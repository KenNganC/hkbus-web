import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BusList from './busList/BusList'
import BusDetail from './busDetail/BusDetail'
import Container from './container/Container'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/busList" replace />} />
          <Route path="busList" element={<BusList />} />
          <Route
            path="busDetail/:stopId/:route/:direction/:serviceType/:seq"
            element={<BusDetail />}
          />
        </Routes>
      </Container>
    </Router>
  </QueryClientProvider>
)

export default App
