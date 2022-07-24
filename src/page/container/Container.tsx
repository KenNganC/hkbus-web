import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import NavBar from './NavBar'

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
        bgcolor={isDark ? '#121111' : '#F6F6F6'}
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
