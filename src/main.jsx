import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MqttProvider } from './store/MqttContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <MqttProvider>
    <ToastContainer />
    <App />
  </MqttProvider>
)
