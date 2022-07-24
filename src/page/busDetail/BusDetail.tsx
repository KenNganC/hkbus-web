/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect } from 'react'
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
  const { route, serviceType, direction, stopId, seq } = useParams()
  const { data: stopList, isLoading } = useStopList()
  const { data: etaData } = useStopETA()
  const stopDetail = stopList?.find((stop) => stop.stop === stopId)
  useEffect(() => {
    if (seq && !isLoading) {
      document.getElementById(seq)?.scrollIntoView()
    }
  }, [seq, isLoading])
  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
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
              id={stop.seq}
              key={stop.seq}
              container
              flexDirection="column"
              width="100%"
              onClick={stopOnClick}
            >
              <Grid item container padding={1} width="100%" flexDirection="column">
                <Typography color="text.primary" sx={{ fontSize: '1.4rem' }}>
                  {stop.name_tc}
                </Typography>
                {etaData?.some((eta) => eta.seq === +stop.seq) && (
                  <Grid p={2}>
                    {etaData.map(
                      (eta) =>
                        eta.timeLeft && (
                          <Box key={eta.eta} display="flex" alignItems="flex-end" gap={1}>
                            <Typography color="primary" sx={{ fontSize: '1.6rem' }}>
                              {`${Math.abs(eta.timeLeft)}`}
                            </Typography>
                            <Typography color="text.primary" sx={{ fontSize: '1rem' }} gutterBottom>
                              分鐘
                            </Typography>
                          </Box>
                        )
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>
      <Button
        sx={{ fontSize: '1.4rem' }}
        onClick={() => {
          navigate(-1)
        }}
      >
        返回
      </Button>
    </Box>
  )
}

export default BusDetail
