import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { getAllETA, getAllStop, getETA, getStopDetails } from '../../api/module/bus'
import { bound, defaultBusStops } from '../../config'

const useStopList = (
  route: string | undefined,
  direction: string | undefined,
  serviceType: string | undefined
) => {
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

const useStopETA = (
  stopId: string | undefined,
  route: string | undefined,
  serviceType: string | undefined,
  direction: string | undefined,
  seq: string | undefined
) => {
  const now = DateTime.now()
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

const useAllETA = () => {
  const now = DateTime.now()
  const { isLoading, error, data, refetch } = useQuery(['stopETA'], async () => {
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
  return { isLoading, error, data, refetch }
}

export { useStopList, useStopETA, useAllETA }
