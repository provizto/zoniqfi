import { Buffer } from 'buffer';
import process from 'process';

// Pastikan objek ini terikat ke window global browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = process;
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)