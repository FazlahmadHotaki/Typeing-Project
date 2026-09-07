import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="910440951545-s4g4c5de142jlvijkuithile5dpol7vn.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>,
)
