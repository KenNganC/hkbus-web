import React, { useEffect } from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useStopETA, useStopList } from '../../model/hook/bus'
import Map from './Map'

const BusDetail = () => {
  const navigate = useNavigate()
  const { route, serviceType, direction, stopId, seq } = useParams()
  const { data: stopList, isLoading } = useStopList(route, direction, serviceType)
  const { data: etaData } = useStopETA(stopId, route, serviceType, direction, seq)
  const stopDetail = stopList?.find((stop) => stop.stop === stopId)
  useEffect(() => {
    if (seq && !isLoading) {
      document.getElementById(seq)?.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }, [seq, isLoading])
  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <Box flex={1} overflow="hidden">
        {stopList && (
          <Map
            key={stopDetail?.stop}
            stopList={stopList}
            lat={+(stopDetail?.lat || 0)}
            long={+(stopDetail?.long || 0)}
          />
        )}
      </Box>
      <Box flex={1} overflow="auto" width="100%" p={1}>
        {stopList?.map((stop) => {
          const stopOnClick = () =>
            // eslint-disable-next-line implicit-arrow-linebreak
            navigate(`/busDetail/${stop.stop}/${route}/${direction}/${serviceType}/${stop.seq}`, {
              replace: true
            })
          return (
            <Grid
              id={stop.seq}
              key={stop.seq}
              container
              sx={{ cursor: 'pointer' }}
              flexDirection="column"
              width="100%"
              onClick={stopOnClick}
              borderBottom="1px solid rgba(128,128,128,.4)"
            >
              <Grid item container padding={1} width="100%" flexDirection="column">
                <Typography color="text.primary" sx={{ fontSize: '1.4rem' }}>
                  {`${stop.seq}. ${stop.name_tc}`}
                </Typography>
                {etaData?.some((eta) => eta.seq === +stop.seq) && (
                  <Grid p={2}>
                    {etaData.map((eta) => (
                      <Box key={eta.eta} display="flex" alignItems="flex-end" gap={1}>
                        <Typography color="primary" sx={{ fontSize: '1.6rem' }}>
                          {eta.timeLeft ? `${Math.abs(eta.timeLeft)}` : '-'}
                        </Typography>
                        <Typography color="text.primary" sx={{ fontSize: '1rem' }} gutterBottom>
                          分鐘
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Box>
      <Button
        sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}
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
