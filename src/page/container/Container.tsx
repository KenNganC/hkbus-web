import React from 'react'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const Container: React.FC<any> = ({ children }) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#FEDB00' },
      background: {
        default: '#000'
      }
    }
  })
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        height="100%"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="background.default"
      >
        <Box height="100%" width="100%" maxWidth="800px">
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Container
