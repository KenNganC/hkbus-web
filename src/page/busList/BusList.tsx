import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Grid } from '@mui/material'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'
import { getAllETA } from '../../api/module/bus'
import { defaultBusStops, bound } from '../../config'

const useAllETA = () => {
  const now = DateTime.now()
  const { isLoading, error, data } = useQuery(['stopETA'], async () => {
    const res = await Promise.all(defaultBusStops.map((stop) => getAllETA(stop.stopId, stop.name)))
    const combinedETAData = res
      .flat()
      .filter((etaItem) => etaItem.eta_seq === 1 && etaItem.eta)
      .map((etaItem) => {
        const eta = DateTime.fromISO(etaItem.eta as string)
        const timeLeft = now.diff(eta, ['minutes']).toObject().minutes || 0
        return {
          ...etaItem,
          timeLeft: Math.round(timeLeft)
        }
      })
    return combinedETAData
  })
  return { isLoading, error, data }
}

const BusList = () => {
  const { isLoading, error, data } = useAllETA()
  const navigate = useNavigate()
  if (isLoading) return <Box>LOADING</Box>
  if (error) return <Box>ERROR</Box>
  return (
    <Box overflow="auto" height="100%">
      {data?.map((route, index) => (
        <Grid
          onClick={() => {
            navigate(
              `/busDetail/${route.stopId}/${route.route}/${bound[route.dir]}/${
                route.service_type
              }/${route.seq}`
            )
          }}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          container
        >
          <Grid
            xs={4}
            item
            container
            padding={1}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Typography color="text.primary" variant="h6">
              {route.route}
            </Typography>
          </Grid>
          <Grid xs={4} item container padding={1} direction="row" alignItems="center">
            <Typography color="text.primary" variant="h6">
              {`往 ${route.dest_tc}`}
            </Typography>
            <Typography color="text.primary" variant="h6">
              {` ${route.stopName}`}
            </Typography>
          </Grid>
          <Grid
            xs={4}
            item
            container
            padding={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Typography color="text.primary" variant="h6">
              {route.timeLeft ? `${Math.abs(route.timeLeft)} 分鐘` : '-'}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Box>
  )
}

export default BusList
