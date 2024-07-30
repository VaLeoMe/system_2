import { MouseEvent, ReactElement } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import { injectedConnector } from '../../utils/connectors'
import { useEagerConnect, useInactiveListener } from '../../utils/hooks'
import { AbstractConnector } from '@web3-react/abstract-connector'
import styled from 'styled-components'
import { GlobalThemeProps } from './index'

type ActivateFunction = (
  connector: AbstractConnector,
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => Promise<void>

function WalletDisconnected(): ReactElement {
  const { activate, active } = useWeb3React<Provider>()

  function handleActivate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault()

    async function _activate(activate: ActivateFunction): Promise<void> {
      await activate(injectedConnector)
    }

    _activate(activate)
  }

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has
  // granted access already
  const eagerConnectionSuccessful = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider,
  // if it exists
  useInactiveListener(!eagerConnectionSuccessful)

  return (
    <StyledActivateButton
      disabled={active}
      style={{
        display: active ? 'none' : 'block'
      }}
      onClick={handleActivate}
    >
      Connect to a wallet
    </StyledActivateButton>
  )
}

const StyledActivateButton = styled.button`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }: GlobalThemeProps) => theme.connectWalletText};
  border-radius: 12px;
  border: 1px solid
    ${({ theme }: GlobalThemeProps) => theme.connectWalletBorder};
  background-color: ${({ theme }: GlobalThemeProps) =>
    theme.connectWalletBackground};
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
`

export default WalletDisconnected
