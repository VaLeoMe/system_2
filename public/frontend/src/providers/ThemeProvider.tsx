import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { useThemeMode } from '../hooks/useThemeMode'
import { lightTheme, darkTheme } from '../styles/themes'

const ThemeContext = ({ children }: { children: ReactElement }) => {
  const { theme } = useThemeMode()

  const themeMode = theme === 'dark' ? darkTheme : lightTheme

  return <ThemeProvider theme={themeMode}>{children}</ThemeProvider>
}

export default ThemeContext
