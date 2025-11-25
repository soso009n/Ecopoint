import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // Import ini

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bungkus App dengan BrowserRouter di sini */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)