/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getAllStop, getETA, getStopDetails } from '../../api/module/bus'
import { bound } from '../../config'

const useStopList = () => {
  const { route, direction, serviceType } = useParams()
  const { isLoading, error, data } = useQuery(
    ['stops', route, direction, serviceType],
    async () => {
      if (!route || !direction || !serviceType) return []
      const allStopDetails = await getAllStop(route, direction, serviceType)
      const allStopInfos = (
        await Promise.all(allStopDetails.map((stop) => getStopDetails(stop.stop)))
      ).flat()
      return allStopDetails.map((r) => ({
        ...r,
        ...allStopInfos.find((b) => b.stop === r.stop)
      }))
    }
  )
  return { isLoading, error, data }
}

const useStopETA = () => {
  const now = DateTime.now()
  const { stopId, route, serviceType, direction, seq } = useParams()
  const { isLoading, error, data } = useQuery(
    ['stops', stopId, route, serviceType, direction, seq],
    async () => {
      if (!stopId || !route || !serviceType || !seq) return []
      const stopETA = await getETA(stopId, route, serviceType)
      const stopETAMapping = stopETA
        .filter((etaItem) => bound[etaItem.dir] === direction && etaItem.seq === +seq)
        .map((etaItem) => {
          if (!etaItem.eta) return { ...etaItem, timeLeft: null }
          const eta = DateTime.fromISO(etaItem.eta)
          const timeLeft = now.diff(eta, ['minutes']).toObject().minutes
          return {
            ...etaItem,
            timeLeft: timeLeft ? Math.round(timeLeft) : null
          }
        })
      return stopETAMapping
    }
  )
  return { isLoading, error, data }
}
const Map = ({ lat, long }: { lat: number; long: number }) => (
  <MapContainer center={[lat, long]} zoom={18}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[lat, long]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
)

const BusDetail = () => {
  const navigate = useNavigate()
  const { route, serviceType, direction, stopId } = useParams()
  const { data: stopList } = useStopList()
  const { data: etaData } = useStopETA()
  const stopDetail = stopList?.find((stop) => stop.stop === stopId)
  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <Button
        onClick={() => {
          navigate(-1)
        }}
      >
        返回
      </Button>
      <Box flex={1} overflow="hidden">
        <Map key={stopDetail?.stop} lat={+(stopDetail?.lat || 0)} long={+(stopDetail?.long || 0)} />
      </Box>
      <Box flex={1} overflow="auto" width="100%">
        {stopList?.map((stop) => {
          const stopOnClick = () =>
            navigate(`/busDetail/${stop.stop}/${route}/${direction}/${serviceType}/${stop.seq}`, {
              replace: true
            })
          return (
            <Grid
              key={stop.seq}
              container
              flexDirection="column"
              width="100%"
              onClick={stopOnClick}
            >
              <Grid item container padding={1} width="100%" flexDirection="column">
                <Typography color="text.primary">{stop.name_tc}</Typography>
                {etaData?.some((eta) => eta.seq === +stop.seq) && (
                  <Grid>
                    {etaData.map(
                      (eta) =>
                        eta.timeLeft && (
                          <Typography color="text.primary" key={eta.eta}>
                            {`${Math.abs(eta.timeLeft)} 分鐘`}
                          </Typography>
                        )
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>
    </Box>
  )
}

export default BusDetail
