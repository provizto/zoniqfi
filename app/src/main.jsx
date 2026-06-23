import { Buffer } from 'buffer';

// Mengunci objek Buffer ke level global runtime browser
window.global = window;
window.Buffer = Buffer;
window.process = { env: {} };

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)