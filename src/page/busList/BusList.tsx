import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Grid } from '@mui/material'
import { getStopETA } from '../../api/module/bus'
import defaultBusStops from '../../config'

const useStopETA = () => {
  const { isLoading, error, data } = useQuery(['stopETA'], async () => {
    const res = await Promise.all(defaultBusStops.map((stop) => getStopETA(stop.stopId)))
    const combinedETAData = res.reduce((p: any[], c) => [...p, ...c.data.data], [])
    return combinedETAData
  })
  return { isLoading, error, data }
}

const BusList = () => {
  const { isLoading, error, data } = useStopETA()
  console.log(data)
  if (isLoading) return <Box>LOADING</Box>
  if (error) return <Box>ERROR</Box>
  return (
    <Box overflow="auto" height="100%">
      <Grid container>
        {data?.map((eta, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <Grid xs={4} item padding={1}>
              <Typography variant="h6">{eta.route}</Typography>
            </Grid>
            <Grid xs={4} item padding={1}>
              <Typography variant="h6">{eta.dest_tc}</Typography>
            </Grid>
            <Grid xs={4} item padding={1}>
              <Typography variant="h6">{eta.eta}</Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}

export default BusList
