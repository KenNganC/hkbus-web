import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { bound } from '../../config'
import { useAllETA } from '../../model/hook/bus'

const BusList = () => {
  const { isLoading, error, data, refetch } = useAllETA()
  const navigate = useNavigate()
  if (isLoading) return <Box>LOADING</Box>
  if (error) return <Box>ERROR</Box>
  return (
    <Box height="100%">
      <PullToRefresh onRefresh={refetch}>
        <Box overflow="auto" height="100%">
          {data?.map((route) => (
            <Grid
              onClick={() => {
                navigate(
                  `/busDetail/${route.stopId}/${route.route}/${bound[route.dir]}/${
                    route.service_type
                  }/${route.seq}`
                )
              }}
              sx={{ cursor: 'pointer' }}
              borderBottom="1px solid rgba(128,128,128,.4)"
              key={route.stopId + route.route}
              container
            >
              <Grid
                xs={3}
                item
                container
                padding={1}
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="text.primary" sx={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                  {route.route}
                </Typography>
              </Grid>
              <Grid xs={7} item container padding={1} direction="column">
                <Typography color="text.primary" sx={{ fontSize: '1.4rem' }}>
                  {`往 ${route.dest_tc}`}
                </Typography>
                <Typography color="text.primary" sx={{ fontSize: '1.4rem' }}>
                  {` ${route.stopName}`}
                </Typography>
              </Grid>
              <Grid
                xs={2}
                item
                container
                paddingRight={3}
                direction="column"
                alignItems="flex-end"
                justifyContent="center"
              >
                <Typography color="primary" sx={{ fontSize: '1.7rem', fontWeight: '600' }}>
                  {route.timeLeft ? `${Math.abs(route.timeLeft)}` : '-'}
                </Typography>
                <Typography color="text.primary" sx={{ fontSize: '1rem' }}>
                  {route.timeLeft ? '分鐘' : ''}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </PullToRefresh>
    </Box>
  )
}

export default BusList
