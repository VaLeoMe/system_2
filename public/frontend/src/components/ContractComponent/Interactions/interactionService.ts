import { BigNumber, Contract } from 'ethers'
import { serializeError } from 'eth-rpc-errors'
import { AddParticipantFormValues } from './AddParticipant'
import { Coordinates, getLocation } from '../../../utils/location'
import { LotHistory, Step } from '../../../types'
import { CheeseChain } from '../../../typechain/CheeseChain'
import { ChangeRoleFormValues } from './ChangeRole'

export type ContractFunctions = {
  addMilkBatch: (coordinates?: Coordinates) => Promise<void>
  addLot: (milkBatchId: number) => Promise<void>
  addStep: (
    lotNumber: number,
    description: string,
    coordinates: Coordinates
  ) => Promise<void>
  addParticipant: ({
    name,
    role,
    address
  }: {
    name: string
    role: Role
    address: string
  }) => Promise<void>
  removeParticipant: (address: string) => Promise<void>
  addResult: (lotNumber: number, result: boolean) => Promise<void>
  getDetails: (lotNumber: number) => Promise<LotHistory>
  changeRole: ({ address, role }: ChangeRoleFormValues) => Promise<void>
}

// add milk Batch

export const addMilkBatch = (contract: CheeseChain) => async (
  location?: Coordinates
) => {
  try {
    location = location ? location : await getLocation()
    console.log('adding milk batch')
    const tx = await contract.addMilkBatch(location)
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(serializeError(e).message)
  }
}

// add Lot

export const addLot = (contract: CheeseChain) => async (
  milkBatchId: number
) => {
  try {
    console.log('adding lot')
    const tx = await contract.addLot([milkBatchId])
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(serializeError(e).message)
  }
}

// add step

export type AddStepFunction = (lotNumber: number) => Promise<void>

export const addStep = (contract: CheeseChain) => async (
  lotNumber: number,
  description: string,
  coordinates: Coordinates
) => {
  try {
    console.log('adding step')
    const tx = await contract?.addStep(lotNumber, description, coordinates)
    await tx.wait()
  } catch (e) {
    window.alert(serializeError(e).message)
  }
}

// add Participant

export enum Role {
  ViewOnly,
  Basic,
  Laboratory,
  MilkProducer,
  Administrator
}

export const roleNames = {
  [Role.ViewOnly]: 'View Only',
  [Role.Basic]: 'Basic',
  [Role.Laboratory]: 'Laboratory',
  [Role.MilkProducer]: 'Milk Producer'
}

export const numberToRole: Record<number, Role> = {
  0: Role.ViewOnly,
  1: Role.Basic,
  2: Role.Laboratory,
  3: Role.MilkProducer
}

export const addParticipant = (contract: CheeseChain) => async ({
  name,
  address,
  role
}: AddParticipantFormValues) => {
  console.log('adding participant')

  try {
    const tx = await contract.addParticipant({
      name,
      role: role,
      owner: address
    })
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(e)
  }
}

export const changeRole = (contract: CheeseChain) => async ({
  address,
  role
}: ChangeRoleFormValues) => {
  console.log('changing role')
  try {
    const tx = await contract.changeParticipantRole(address, role)
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(e)
  }
}

// add Lab Result
export type AddResultFunction = (
  lotNumber: number,
  result: boolean,
  contract: Contract
) => Promise<void>

export const addResult = (contract: CheeseChain) => async (
  lotNumber: number,
  result: boolean
) => {
  console.log('adding Result')

  try {
    let tx
    if (result) {
      tx = await contract.addLabResult(lotNumber, true)
    } else {
      tx = await contract.addLabResult(lotNumber, false)
    }
    // const tx = await contract.addLabResult(lotNumber, result ? true : false)
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(serializeError(e).message)
  }
}

// remove participant

export type RemoveParticipantFunction = (
  address: string,
  contract: CheeseChain
) => Promise<void>

export const removeParticipant = (contract: CheeseChain) => async (
  address: string
) => {
  console.log('removing participant')

  try {
    const tx = await contract.removeParticipant(address)
    const receipt = await tx.wait()
    console.log(receipt)
  } catch (e) {
    window.alert(serializeError(e).message)
  }
}

const createStepObject = (contract: CheeseChain) => async (step: {
  owner: string
  timestamp: number
  coordinates: CheeseChain.CoordinatesStructOutput
  description: string
}): Promise<Step> => {
  const admin = await contract.administrator()
  const participant = await contract.participants(step.owner)

  const stepObject: Step = {
    owner: {
      role: admin === step.owner ? Role.Administrator : participant.role,
      name: admin === step.owner ? 'Administrator' : participant.name,
      address: step.owner
    },
    timestamp: step.timestamp,
    coordinates: step.coordinates,
    description: step.description
  }

  return stepObject
}

export const getDetails = (contract: CheeseChain) => async (
  lotNumber: number
): Promise<LotHistory> => {
  let steps: Array<{
    owner: string
    timestamp: BigNumber
    coordinates: CheeseChain.CoordinatesStructOutput
    description: string
  }> = []
  const lot = await contract.getLot(lotNumber)
  console.log('getting details')

  const milkProductions = lot.milkBatchId.reverse().map(async (m) => {
    const batch = await contract.milkBatches(m)
    const batchObject = {
      owner: batch.owner,
      timestamp: batch.timestamp,
      coordinates: batch.coordinates
    }
    return { ...batchObject, description: 'Milk Produced' }
  })

  let lastStep = lot.lastStep.toNumber()
  while (lastStep !== 0) {
    const step = await contract.steps(lastStep)
    lastStep = step.previousStep.toNumber()
    steps.push(step)
  }

  steps = [...(await Promise.all(milkProductions)), ...steps.reverse()]

  const internalSteps = steps.map((step) => {
    return createStepObject(contract)({
      owner: step.owner,
      timestamp: step.timestamp.toNumber(),
      coordinates: step.coordinates,
      description: step.description
    })
  })

  return {
    lotNumber: lotNumber,
    steps: await Promise.all(internalSteps),
    labResult: {
      result: lot.testResult.result,
      timestamp: lot.testResult.timestamp.toNumber()
    }
  }
}
