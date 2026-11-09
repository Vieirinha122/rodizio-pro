import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import { EditorFormacoes } from './pages/EditorFormacoes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === '/editor' ? <EditorFormacoes /> : <App />}
  </StrictMode>,
)
