import { HiMoon } from 'react-icons/hi'
import { FaSun } from 'react-icons/fa'
import styled, { ThemeContext } from 'styled-components'
import { GlobalThemeProps } from './ConnectWallet'
import { useContext } from 'react'
import { ThemeProps } from '../styles/themes'

function TogglerButton({ themeToggler }: { themeToggler: () => void }) {
  const themeContext: ThemeProps = useContext(ThemeContext)

  return (
    <ToggleContainer onClick={themeToggler}>
      {themeContext.name === 'light' ? <Sun /> : <Moon />}
    </ToggleContainer>
  )
}

export const ToggleContainer = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: ${({ theme }: GlobalThemeProps) => theme.highlight};
  border: 1px solid
    ${({ theme }: GlobalThemeProps) => theme.connectWalletBorder};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 350px) {
    position: absolute;
    right: 8px;
    bottom: 8px;
  }
`

export const Sun = styled(FaSun)`
  color: black;
`

export const Moon = styled(HiMoon)`
  color: white;
`

export default TogglerButton
