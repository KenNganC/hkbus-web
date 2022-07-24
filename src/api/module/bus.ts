import axios from 'axios'
import BUS_URL from '../url'

interface BusApi<T> {
  type: string
  version: string
  generated_timestamp: string
  data: T
}

interface EtaItem {
  co: string
  route: string
  dir: string
  service_type: number
  seq: number
  dest_tc: string
  dest_sc: string
  dest_en: string
  eta_seq: number
  eta: string | null
  rmk_tc: string
  rmk_sc: string
  rmk_en: string
  data_timestamp: string
  stopName?: string
  stopId?: string
}

interface StopDetail {
  bound: string
  route: string
  seq: string
  service_type: string
  stop: string
}

interface StopInfo {
  stop: string
  name_en: string
  name_tc: string
  name_sc: string
  lat: string
  long: string
}

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
