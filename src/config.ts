import { Home, Settings, Info } from '@mui/icons-material'

const defaultBusStops = [
  { name: '荃景圍天橋', stopId: 'BFA3460955AC820C' },
  { name: '荃灣柴灣角街', stopId: '5FB1FCAF80F3D97D' }
]

const routes = [
  { label: 'Home', path: '/busList', icon: Home },
  { label: 'Detail', path: '/busDetail', icon: Info },
  { label: 'Setting', path: '/setting', icon: Settings }
]

const bound: Record<string, string> = {
  O: 'outbound',
  I: 'inbound'
}

export { defaultBusStops, routes, bound }
