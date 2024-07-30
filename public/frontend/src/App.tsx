import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import Navbar from './components/Navbar'
import useThemeMode from './hooks/useThemeMode'
import { lightTheme, darkTheme } from './styles/themes'
import { GlobalStyle } from './styles/global'
import ContractInteractions from './components/ContractComponent/ContractInteractions'
import { LotHistory } from './components/LotHistory'
import ContractProvider from './providers/ContractProvider'
import FunctionsProvider from './providers/FunctionsProvider'
import { LocationProvider } from './providers/LocationProvider'
import HistoryModal from './components/History/HistoryModal'
import { useSelector } from 'react-redux'
import { selectModal } from './app/modalSlice'

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const App = () => {
  const { theme, themeToggler } = useThemeMode()
  const themeMode = theme === 'light' ? lightTheme : darkTheme
  const isModalOpen = useSelector(selectModal)

  return (
    <ThemeProvider theme={themeMode}>
      <LocationProvider>
        <GlobalStyle />
        <AppWrapper
          style={isModalOpen ? { height: '100vh', overflow: 'hidden' } : {}}
        >
          <Navbar themeToggler={themeToggler} />
          <ContractProvider>
            <FunctionsProvider>
              <ContractInteractions />
              <LotHistory />
              {isModalOpen && <HistoryModal />}
            </FunctionsProvider>
          </ContractProvider>
        </AppWrapper>
      </LocationProvider>
    </ThemeProvider>
  )
}

export default App
