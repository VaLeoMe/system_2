import { ethers } from 'ethers'
import { connect } from './providers'
import { Request, Response } from 'express'
import { Role } from './types'
import { handleRpcErrors, rpcErrors } from './rpcErrors'
import { CheeseChain } from './typechain'
const CheeseChainArtifact = require('../abi/CheeseChain.json')

const [provider, wallet, contractAt] = connect()

// first steps
export const deployContract = async () => {
  const CheeseChain = new ethers.ContractFactory(
    CheeseChainArtifact.abi,
    CheeseChainArtifact.bytecode,
    wallet,
  )
  try {
    const newContractInstance: CheeseChain = (await CheeseChain.deploy()) as CheeseChain

    await newContractInstance.deployed()

    process.env.CONTRACT_ADDRESS = newContractInstance.address

    return { contractAddress: newContractInstance.address }
  } catch (error) {
    return { error: error }
  }
}

// general functions
export const getBlock = async () => {
  const currentBlock = await provider.getBlockNumber()
  return { currentBlock }
}

export const getContractAddress = async () => {
  const contractAddress = process.env.CONTRACT_ADDRESS
  return { contractAddress }
}

// contract variables
export const getAdmin = async (req: Request) => {
  return { adminAddress: await req.cc!.administrator() }
}

export const getTotalLots = async (req: Request) => {
  const totalLots = (await req.cc!.totalLots())?.toNumber()
  return { totalLots }
}

export const getTotalSteps = async (req: Request) => {
  const totalSteps = (await req.cc!.totalSteps())?.toNumber()
  return { totalSteps }
}

export const getTotalMilkBatches = async (req: Request) => {
  const totalMilkBatches = (await req.cc!.totalBatches())?.toNumber()
  return { totalMilkBatches }
}

// mapping information
export const getLot = async (req: Request) => {
  const lot = await req.cc!.getLot(req.params.id)
  return {
    timestamp: lot?.timestamp.toNumber(),
    lastStep: lot?.lastStep.toNumber(),
    testResult: {
      result: lot?.testResult.result,
      timestamp: lot?.testResult.timestamp.toNumber(),
    },
  }
}

export const getStep = async (req: Request) => {
  const step = await req.cc!.steps(req.params.id)
  return {
    owner: step.owner,
    previousStep: step.previousStep.toNumber(),
    timestamp: step.timestamp.toNumber(),
    description: step.description,
  }
}

export const getMilkBatch = async (req: Request) => {
  const batch = await req.cc!.milkBatches(req.params.id)

  return {
    timestamp: batch.timestamp.toNumber,
    owner: batch.owner,
    coordinates: {
      latitude: batch.coordinates.latitude,
      longitude: batch.coordinates.longitude,
    },
  }
}

export const getParticipant = async (req: Request) => {
  const participant = await req.cc!.participants(req.params.address)
  return {
    name: participant.name,
    role: participant.role,
    owner: participant.owner,
  }
}

// core functions

type Coordinates = {
  coordinates: {
    longitude: number
    latitude: number
  }
}

export const addMilkBatch = async (
  req: Request<{}, {}, Coordinates>,
  res: Response,
) => {
  if (!req.body.coordinates) {
    res.status(400).json({ error: 'Please include coordinates' })
    return
  }

  if (
    typeof req.body.coordinates.latitude !== 'number' ||
    typeof req.body.coordinates.longitude !== 'number'
  ) {
    res.status(400).json({ error: 'Longitude and latitude must be numbers' })
    return
  }
  const parsedCoordinates = {
    longitude: req.body.coordinates.longitude.toString(),
    latitude: req.body.coordinates.latitude.toString(),
  }
  try {
    const tx = await req.cc!.addMilkBatch(parsedCoordinates)
    const receipt = await tx.wait()
    return {
      milkBatchId: receipt.events![0].args!._milkBatchId.toNumber(),
    }
  } catch (error) {
    handleRpcErrors(error, [rpcErrors.onlyMilkProducer], res)
  }
}

type AddLotBody = {
  milkBatchIds: Array<number>
}

export const addLot = async (
  req: Request<{}, {}, AddLotBody>,
  res: Response,
) => {
  if (!req.body.milkBatchIds || typeof req.body.milkBatchIds !== 'object') {
    res.status(400).json({
      error: 'Invalid body! Please Provide milk batches as an array of string.',
    })
    return
  }
  const { milkBatchIds } = req.body
  try {
    const tx = await req.cc!.addLot(milkBatchIds)
    const receipt = await tx.wait()
    return { lotId: receipt.events![0].args!._lotId.toNumber() }
  } catch (error) {
    handleRpcErrors(
      error,
      [rpcErrors.onlyBasic, rpcErrors.onlyValidMilkBatch],
      res,
    )
  }
}

type AddStepBody = {
  lotNumber: number
  coordinates: {
    longitude: number
    latitude: number
  }
  description: string
}

export const addStep = async (
  req: Request<{}, {}, AddStepBody>,
  res: Response,
) => {
  if (!req.body.lotNumber) {
    res.status(400).json({ error: 'Please include lotNumber' })
    return
  }
  if (!req.body.description) {
    res.status(400).json({ error: 'Please include a description' })
    return
  }
  if (!req.body.coordinates) {
    res.status(400).json({ error: 'Please include coordinates' })
    return
  }

  if (
    typeof req.body.coordinates.latitude !== 'number' ||
    typeof req.body.coordinates.longitude !== 'number'
  ) {
    res.status(400).json({ error: 'Longitude and latitude must be numbers' })
    return
  }
  const parsedCoordinates = {
    longitude: req.body.coordinates.longitude.toString(),
    latitude: req.body.coordinates.latitude.toString(),
  }
  try {
    const tx = await req.cc!.addStep(
      req.body.lotNumber,
      req.body.description,
      parsedCoordinates,
    )
    const receipt = await tx.wait()
    return { stepId: receipt.events![0].args!._stepId.toNumber() }
  } catch (error) {
    handleRpcErrors(error, [rpcErrors.onlyBasic, rpcErrors.lotExists], res)
  }
}

type addParticipantPayload = {
  name: string
  address: string
}

type addParticipantContractParams = {
  name: string
  owner: string
  role: number
}

export const addParticipant = (role: Role) => async (
  req: Request,
  res: Response,
) => {
  const body: addParticipantPayload = req.body
  if (!body.address || !body.name) {
    res.status(400).json({ error: 'Invalid body! Provide address and name' })
    return
  }
  if (typeof body.address !== 'string' || typeof body.name !== 'string') {
    res.status(400).json({ error: 'Address and name must be strings!' })
    return
  }

  const contractParams: addParticipantContractParams = {
    name: body.name,
    owner: body.address,
    role: role,
  }
  try {
    const tx = await req.cc!.addParticipant(contractParams)
    const receipt = await tx.wait()
    const newParticipant = receipt.events![0].args!.participant
    return {
      name: newParticipant.name,
      role: newParticipant.role,
      owner: newParticipant.owner,
    }
  } catch (error) {
    handleRpcErrors(
      error,
      [
        rpcErrors.onlyAdmin,
        rpcErrors.notEmptyAddress,
        rpcErrors.participantExists,
      ],
      res,
    )
  }
}

export const removeParticipant = async (
  req: Request<{}, {}, { address: string }>,
  res: Response,
) => {
  if (!req.body.address || typeof req.body.address !== 'string') {
    res.status(400).json({ error: 'Invalid body! Provide address as a string' })
    return
  }
  try {
    const tx = await req.cc!.removeParticipant(req.body.address)
    const receipt = await tx.wait()
    return { transactionHash: receipt.transactionHash }
  } catch (error) {
    handleRpcErrors(
      error,
      [rpcErrors.onlyAdmin, rpcErrors.participantDoesntExist],
      res,
    )
  }
}

type changeRolePayload = {
  address: string
  newRole: Role
}

export const changeRole = async (
  req: Request<{}, {}, changeRolePayload>,
  res: Response,
) => {
  if (!req.body.address || typeof req.body.address !== 'string') {
    res.status(400).json({ error: 'Invalid body! Provide address as a string' })
    return
  }
  if (!req.body.newRole || typeof req.body.newRole !== 'number') {
    res
      .status(400)
      .json({ error: 'Invalid body! Provide the new Role as an integer' })
    return
  }
  try {
    const tx = await req.cc!.changeParticipantRole(
      req.body.address,
      req.body.newRole,
    )
    const receipt = await tx.wait()
    const newParticipant = receipt.events![0].args!.participant
    return {
      name: newParticipant.name,
      role: newParticipant.role,
      owner: newParticipant.owner,
    }
  } catch (error) {
    handleRpcErrors(
      error,
      [rpcErrors.onlyAdmin, rpcErrors.participantDoesntExist],
      res,
    )
  }
}

type addLabResultPayload = {
  lotNumber: number
  result: boolean
}

export const addLabResult = async (
  req: Request<{}, {}, addLabResultPayload>,
  res: Response,
) => {
  const body: addLabResultPayload = req.body
  if (!req.body.lotNumber || typeof req.body.lotNumber !== 'number') {
    res
      .status(400)
      .json({ error: 'Invalid body! Provide lotNumber as a number' })
    return
  }
  if (!req.body.result || typeof req.body.result !== 'boolean') {
    res
      .status(400)
      .json({ error: 'Invalid body! Provide the result as a boolean' })
    return
  }
  try {
    const tx = await req.cc!.addLabResult(body.lotNumber, body.result)
    const receipt = await tx.wait()
    const args = receipt.events![0].args!
    return {
      lotNumber: args._lotId.toNumber(),
      result: args._result,
      timestamp: args._timestamp.toNumber(),
    }
  } catch (error) {
    handleRpcErrors(error, [rpcErrors.onlyLab], res)
  }
}
