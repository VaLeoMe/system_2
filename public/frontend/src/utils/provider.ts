import { Web3Provider } from '@ethersproject/providers'
import type { Web3Provider as ProviderType } from '@ethersproject/providers'

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 1000
  return library
}

export type Provider = ProviderType
