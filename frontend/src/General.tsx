import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './layouts/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material"



const theme = createTheme({
    palette: { mode: 'dark' },
})



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </ThemeProvider>
  </StrictMode>,
)
