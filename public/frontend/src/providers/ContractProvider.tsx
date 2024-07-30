import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { ethers, Signer } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../utils/provider'
import CheeseChainArtifact from '../artifacts/contracts/CheeseChain.sol/CheeseChain.json'
import RegisterContract from '../components/ContractComponent/RegisterContract'
import { CheeseChain } from '../typechain'

export const ContractContext = createContext<CheeseChain | undefined>(undefined)
ContractContext.displayName = 'ContractContext'

export const useContract = (): CheeseChain => {
  const contract = useContext(ContractContext)
  if (!contract) {
    throw new Error('contract missing')
  }
  return contract
}

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { library } = useWeb3React<Provider>()
  const [signer, setSigner] = useState<Signer>()
  const [contract, setContract] = useState<CheeseChain | undefined>()

  useEffect((): void => {
    if (!library) {
      setSigner(undefined)
      return
    }

    setSigner(library.getSigner())
  }, [library])

  useEffect(() => {
    const envContract = process.env.REACT_APP_CONTRACT

    if (envContract === '' || envContract === undefined) return

    if (signer) {
      const CheeseChain: CheeseChain = new ethers.Contract(
        envContract,
        CheeseChainArtifact.abi,
        signer
      ) as CheeseChain
      setContract(CheeseChain)
    } else {
      const provider = ethers.getDefaultProvider(process.env.REACT_APP_PROVIDER)
      const providerContract: CheeseChain = new ethers.Contract(
        envContract,
        CheeseChainArtifact.abi,
        provider
      ) as CheeseChain
      setContract(providerContract)
    }
  }, [setContract, signer])

  return contract === undefined ? (
    <RegisterContract setContract={setContract} />
  ) : (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider
