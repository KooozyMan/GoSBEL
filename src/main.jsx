import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

// css files
import './assets/css/index.css'
import './assets/css/popups.css'
import './assets/css/panels.css'
import './assets/css/nodes.css'
import './assets/css/generated-code.css'
import './assets/css/root.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
