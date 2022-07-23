import axios from 'axios'
import BUS_URL from '../url'

// interface Bus {
//   type: string
//   version: string
//   generated_timestamp: string
// }

// interface GetStopETAResponse extends Bus {
//   data: Array<{
//     co: string
//     route: string
//     dir: string
//     service_type: number
//     seq: number
//     dest_tc: string
//     dest_sc: string
//     dest_en: string
//     eta_seq: number
//     eta: string | null
//     rmk_tc: string
//     rmk_sc: string
//     rmk_en: string
//     data_timestamp: string
//   }>
// }

const getStopETA = (stopId: string) => {
  const res = axios.get(BUS_URL.eta + stopId)
  return res
}

// eslint-disable-next-line import/prefer-default-export
export { getStopETA }
