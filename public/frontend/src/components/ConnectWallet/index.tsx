import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector'
import { ReactElement } from 'react'
import { Provider } from '../../utils/provider'
import { ThemeProps } from '../../styles/themes'
import WalletDisconnected from './WalletDisconnected'
import WalletConnected from './WalletConnected'

export type GlobalThemeProps = {
  theme: ThemeProps
}

function getErrorMessage(error: Error): string {
  let errorMessage: string

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`
      break
    case UnsupportedChainIdError:
      errorMessage = `You're connected to an unsupported network.`
      break
    case UserRejectedRequestError:
      errorMessage = `Please authorize this website to access your Ethereum account.`
      break
    default:
      console.log(error.message)
      errorMessage = error.message
  }

  return errorMessage
}

export const ConnectWallet = (): ReactElement => {
  const { error } = useWeb3React<Provider>()

  if (!!error) {
    window.alert(getErrorMessage(error))
  }

  return (
    <>
      <WalletDisconnected />
      <WalletConnected />
    </>
  )
}
