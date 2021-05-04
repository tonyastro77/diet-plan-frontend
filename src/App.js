import React from 'react'
import './App.css'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './stylings/Theme'
import Home from './Home'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  )
}

export default App
