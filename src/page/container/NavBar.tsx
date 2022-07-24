import React from 'react'
import Box from '@mui/material/Box'
import { IconButton, Typography } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'

const NavBar = (props: { dark: boolean; setIsDark: () => void }) => {
  const { dark, setIsDark } = props
  return (
    <Box width="100%" maxWidth="800px" pt={2} pb={1} bgcolor="background.default">
      <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Typography fontWeight="bold" color="text.primary" px={2}>
          HK Bus
        </Typography>
        <Box px={2}>
          <IconButton onClick={setIsDark}>{dark ? <LightMode /> : <DarkMode />}</IconButton>
        </Box>
      </Box>
    </Box>
  )
}
export default NavBar
