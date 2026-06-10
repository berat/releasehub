import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

if (import.meta.env.PROD) {
  // Umami
  const umami = document.createElement('script')
  umami.defer = true
  umami.src = 'https://analytics.beratbozkurt.net/script.js'
  umami.setAttribute('data-website-id', '72b60c1a-4e02-4d45-9ca0-85d159b9e537')
  document.head.appendChild(umami)

  // Google Analytics
  const gtag = document.createElement('script')
  gtag.async = true
  gtag.src = 'https://www.googletagmanager.com/gtag/js?id=G-X6072H0MTX'
  document.head.appendChild(gtag)

  const gtagInit = document.createElement('script')
  gtagInit.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-X6072H0MTX');`
  document.head.appendChild(gtagInit)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
