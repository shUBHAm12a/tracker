import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppProvider } from './context/AppContext'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    // @ts-ignore
    <AppProvider>
      <App />
    </AppProvider>
  )
}
