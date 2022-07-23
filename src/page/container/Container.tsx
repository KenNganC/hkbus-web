import React from 'react'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'

const routes = [
  { label: 'Home', path: '/buslist' },
  { label: 'Setting', path: '/setting' }
]
const TabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTab = routes.findIndex((route) => route.path === location.pathname) || 0
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <BottomNavigation
        showLabels
        value={currentTab}
        onChange={(event, newValue) => {
          navigate(routes[newValue].path)
        }}
      >
        {routes.map((route) => (
          <BottomNavigationAction key={route.label} label={route.label} />
        ))}
      </BottomNavigation>
    </Box>
  )
}

const Container: React.FC<any> = ({ children }) => (
  <Box height="100%" overflow="hidden" display="flex" flexDirection="column" alignItems="center">
    <Box height="calc(100% - 56px);" minWidth="600px" maxWidth="40vw">
      {children}
    </Box>
    <TabBar />
  </Box>
)

export default Container
