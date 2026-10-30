import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { AuthProvider } from "./AuthContext";
import App from './App.jsx'
import { PanierProvider } from './PanierContext.jsx';





createRoot(document.getElementById('root')).render(
  <StrictMode className="layout">
      <BrowserRouter>
        <AuthProvider>
          <PanierProvider>
    
    
            <App />
          </PanierProvider>
        </AuthProvider>
      </BrowserRouter>
    
  </StrictMode>
 
)
