/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
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
  const { stopId, route, serviceType, direction } = useParams()
  const { isLoading, error, data } = useQuery(['stops', stopId], async () => {
    if (!stopId || !route || !serviceType) return []
    const stopETA = await getETA(stopId, route, serviceType)
    const stopETAMapping = stopETA
      .filter((etaItem) => bound[etaItem.dir] === direction)
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
  })
  return { isLoading, error, data }
}

const BusDetail = () => {
  const navigate = useNavigate()
  const { route, serviceType, direction } = useParams()
  const { data: StopList } = useStopList()
  const { data: etaData } = useStopETA()
  console.log(etaData)
  return (
    <Box overflow="auto" height="100%" width="100%" display="flex" flexDirection="column">
      <Button
        onClick={() => {
          navigate(-1)
        }}
      >
        Back
      </Button>
      <Box flex={1}>1433</Box>
      <Box flex={1} overflow="auto" width="100%">
        {StopList?.map((stop) => {
          const stopOnClick = () =>
            navigate(`/busDetail/${stop.stop}/${route}/${direction}/${serviceType}`, {
              replace: true
            })
          return (
            <Grid
              key={stop.stop + stop.bound}
              container
              flexDirection="column"
              width="100%"
              onClick={stopOnClick}
            >
              <Grid item container padding={1} width="100%" flexDirection="column">
                <Typography color="text.primary">{stop.name_tc}</Typography>
                {etaData?.some((eta) => eta.stopId === stop.stop) && (
                  <Grid>
                    {etaData.map(
                      (eta) =>
                        eta.timeLeft && (
                          <Typography color="text.primary" key={eta.eta}>
                            {`${Math.abs(eta.timeLeft)} min`}
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
