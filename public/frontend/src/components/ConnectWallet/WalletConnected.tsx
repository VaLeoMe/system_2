import { MouseEvent, ReactElement } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import styled from 'styled-components'
import { GlobalThemeProps } from './index'
import { ChainDisplayer } from './ChainDisplayer'
import { Balance } from './Balance'
import { UserInfo } from '../UserInfo'
import { useDispatch } from 'react-redux'
import { logout } from '../../app/userSlice'

const WalletConnected = (): ReactElement => {
  const { deactivate, active, account } = useWeb3React<Provider>()
  const dispatch = useDispatch()

  function handleDeactivate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault()

    deactivate()
    dispatch(logout())
  }

  return (
    <Wrapper
      style={{
        display: active ? 'flex' : 'none',
        gap: 8
      }}
    >
      <UserInfo />
      <ChainDisplayer />
      <ConnectButtonWrapper>
        <Balance />
        <StyledConnectedButton disabled={!active} onClick={handleDeactivate}>
          {typeof account === 'undefined'
            ? ''
            : account
            ? `${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`
            : ''}
        </StyledConnectedButton>
      </ConnectButtonWrapper>
    </Wrapper>
  )
}

const StyledConnectedButton = styled.button`
  height: 36px;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }: GlobalThemeProps) => theme.text};
  border-radius: 14px;
  border: 1px solid ${({ theme }: GlobalThemeProps) => theme.highlightBorder};
  background-color: ${({ theme }: GlobalThemeProps) => theme.foreground};
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
  margin-left: 1px;
  margin-right: 2px;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const ConnectButtonWrapper = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }: GlobalThemeProps) => theme.highlight};
  border-radius: 16px;
`

export default WalletConnected
