import React, { useEffect } from 'react'
import { Wrapper } from './styles'
import { AddLot } from './Interactions/AddLot'
import { AddStep } from './Interactions/AddStep'
import { AddResult } from './Interactions/AddResult'
import { AddParticipant } from './Interactions/AddParticipant'
import { RemoveParticipant } from './Interactions/RemoveParticipant'
import { AddMilkBatch } from './Interactions/AddMilkBatch'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import { useContract } from '../../providers/ContractProvider'
import { Role } from './Interactions/interactionService'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, login } from '../../app/userSlice'
import { ChangeRole } from './Interactions/ChangeRole'

const isMilkProducer = (role: Role) => {
  return role === Role.MilkProducer || role === Role.Administrator
}

const isBasic = (role: Role) => {
  return role === Role.Basic || role === Role.Administrator
}

const isLab = (role: Role) => {
  return role === Role.Laboratory || role === Role.Administrator
}

const isAdmin = (role: Role) => {
  return role === Role.Administrator
}

const ContractInteractions = () => {
  const { account } = useWeb3React<Provider>()
  const contract = useContract()
  const user = useSelector(selectUser)

  const dispatch = useDispatch()

  useEffect(() => {
    const getParticipant = async (address: string) => {
      const admin = await contract.administrator()
      const participant = await contract.participants(address)
      const newUser =
        admin === account
          ? {
              role: Role.Administrator
            }
          : { name: participant.name, role: participant.role }
      dispatch(login(newUser))
    }
    if (account) {
      getParticipant(account)
    }
  }, [account, contract, dispatch])

  return account && user && user.role !== 0 ? (
    <Wrapper>
      {isMilkProducer(user.role) && <AddMilkBatch />}
      {isBasic(user.role) && (
        <>
          <AddLot />
          <AddStep />
        </>
      )}
      {isLab(user.role) && <AddResult />}
      {isAdmin(user.role) && (
        <>
          <AddParticipant />
          <ChangeRole />
          <RemoveParticipant />
        </>
      )}
    </Wrapper>
  ) : (
    <></>
  )
}

export default ContractInteractions
