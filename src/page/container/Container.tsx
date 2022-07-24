import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { IconButton, Typography } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'

const NavBar = ({ dark, setIsDark }: { dark: boolean; setIsDark: () => void }) => (
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

const Container: React.FC<any> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)
  const theme = createTheme({
    palette: isDark
      ? { mode: 'dark', primary: { main: '#FEDB00' }, background: { default: '#000' } }
      : { primary: { main: '#e3c71c' }, background: { default: '#fff' } }
  })
  const setColorMode = () => setIsDark(!isDark)
  return (
    <ThemeProvider theme={theme}>
      <Box
        height="100%"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor={isDark ? 'background.default' : '#F6F6F6'}
        position="relative"
      >
        <NavBar dark={isDark} setIsDark={setColorMode} />
        <Box flex={1} width="100%" maxWidth="800px" overflow="hidden" bgcolor="background.default">
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Container
