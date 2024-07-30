import styled from 'styled-components'
import { ConnectWallet } from './ConnectWallet'
import ThemeToggler from './ThemeToggler'
import { Routes, Route } from 'react-router-dom'

const NavWrapper = styled.div`
  flex: 0 0 120px;
  align-items: center;
  width: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 500px) {
    padding: 8px;
  }
`

const StyledImg = styled.img`
  height: 50px;
  @media screen and (max-width: 350px) {
    height: 40px;
  }
`

const Title = styled.h1`
  @media screen and (max-width: 1000px) {
    display: none;
  }
`

type ThemeTogglerProps = {
  themeToggler: () => void
}

const Navbar = ({ themeToggler }: ThemeTogglerProps) => {
  const connector = (
    <div style={{ display: 'flex', gap: 8 }}>
      <ConnectWallet />
      <ThemeToggler themeToggler={themeToggler} />
    </div>
  )

  return (
    <NavWrapper>
      <LogoWrapper>
        <Title>Cheese Chain</Title>
        <X>X</X>
        <StyledImg src="/logo-tete-de-moine.png" alt="Tete de Moine Logo" />
      </LogoWrapper>
      <Routes>
        <Route path="/connect" element={connector} />
        <Route
          path="/"
          element={<ThemeToggler themeToggler={themeToggler} />}
        />
      </Routes>
    </NavWrapper>
  )
}

export default Navbar

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 1000px) {
    flex-direction: row;
  }
`

const X = styled.div`
  @media screen and (max-width: 1000px) {
    display: none;
  }
`
