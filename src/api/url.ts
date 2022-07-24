const BASE_URL: string = 'https://data.etabus.gov.hk/'

const BUS_URL = {
  etaList: `${BASE_URL}v1/transport/kmb/stop-eta`,
  allStops: `${BASE_URL}v1/transport/kmb/route-stop`,
  stopDetail: `${BASE_URL}v1/transport/kmb/stop`,
  eta: `${BASE_URL}v1/transport/kmb/eta`
}

export default BUS_URL
