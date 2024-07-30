import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { ContractContext, useContract } from './ContractProvider'
import {
  addMilkBatch,
  addLot,
  addParticipant,
  addResult,
  addStep,
  ContractFunctions,
  removeParticipant,
  getDetails,
  changeRole
} from '../components/ContractComponent/Interactions/interactionService'

export const ContractFunctionsContext = createContext<
  ContractFunctions | undefined
>(undefined)
ContractContext.displayName = 'ContractContext'

export const useFunctions = (): ContractFunctions => {
  const functions = useContext(ContractFunctionsContext)
  if (!functions) {
    throw new Error('no functions')
  }
  return functions
}

const FunctionsProvider = ({ children }: { children: ReactNode }) => {
  const contract = useContract()
  const [contractFunctions, setContractFunctions] = useState<ContractFunctions>(
    {
      addMilkBatch: addMilkBatch(contract),
      addLot: addLot(contract),
      addStep: addStep(contract),
      addParticipant: addParticipant(contract),
      removeParticipant: removeParticipant(contract),
      addResult: addResult(contract),
      getDetails: getDetails(contract),
      changeRole: changeRole(contract)
    }
  )

  useEffect(() => {
    setContractFunctions({
      addMilkBatch: addMilkBatch(contract),
      addLot: addLot(contract),
      addStep: addStep(contract),
      addParticipant: addParticipant(contract),
      removeParticipant: removeParticipant(contract),
      addResult: addResult(contract),
      getDetails: getDetails(contract),
      changeRole: changeRole(contract)
    })
  }, [contract])

  return (
    <ContractFunctionsContext.Provider value={contractFunctions}>
      {children}
    </ContractFunctionsContext.Provider>
  )
}

export default FunctionsProvider
