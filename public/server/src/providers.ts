import { ethers, providers, utils, Wallet } from 'ethers'
import { getContract } from './utils'

const connect = (): [providers.Provider, Wallet, any] => {
  
  const provider = new providers.JsonRpcProvider(process.env.NODE_URL)

  // use private key for wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  const contractAt = getContract(wallet)
 

  return [provider, wallet, contractAt]
}

export { connect }
