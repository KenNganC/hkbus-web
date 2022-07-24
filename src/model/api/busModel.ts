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

export type { BusApi, EtaItem, StopInfo, StopDetail }
