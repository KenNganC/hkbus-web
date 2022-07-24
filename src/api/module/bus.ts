import axios from 'axios'
import { BusApi, EtaItem, StopDetail, StopInfo } from '../../model/api/busModel'
import BUS_URL from '../url'

const getAllETA = async (stopId: string, stopName: string) => {
  const res = await axios.get<BusApi<EtaItem[]>>(`${BUS_URL.etaList}/${stopId}`)
  const data = res.data.data.map((item) => ({ ...item, stopName, stopId }))
  return data
}

const getAllStop = async (route: string, direction: string, serviceType: string) => {
  const res = await axios.get<BusApi<StopDetail[]>>(
    `${BUS_URL.allStops}/${route}/${direction}/${serviceType}`
  )
  return res.data.data
}

const getStopDetails = async (stopId: string) => {
  const res = await axios.get<BusApi<StopInfo[]>>(`${BUS_URL.stopDetail}/${stopId}`)
  return res.data.data
}

const getETA = async (stopId: string, route: string, serviceType: string) => {
  const res = await axios.get<BusApi<EtaItem[]>>(`${BUS_URL.eta}/${stopId}/${route}/${serviceType}`)
  const data = res.data.data.map((item) => ({ ...item, stopId }))
  return data
}

export { getAllETA, getAllStop, getStopDetails, getETA }
