import React from 'react'
import ReactDOM from 'react-dom/client'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider as ReduxProvider } from 'react-redux'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { getLibrary } from './utils/provider'
import store from './app/store'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3ReactProvider>
    </ReduxProvider>
  </React.StrictMode>
)

reportWebVitals()
