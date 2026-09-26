import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './layouts/App.tsx'
import './plugins/i18n/index.ts'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
