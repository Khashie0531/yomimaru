import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { AuthProvider } from './app/contexts/AuthContext'

// CSS
import './styles/index.css'
import 'leaflet/dist/leaflet.css'

// i18n
import './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
