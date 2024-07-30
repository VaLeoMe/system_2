import { create } from 'domain'
import { Request, Response } from 'express'
import {
  addLabResult,
  addLot,
  addMilkBatch,
  addParticipant,
  addStep,
  changeRole,
  deployContract,
  getAdmin,
  getBlock,
  getContractAddress,
  getLot,
  getMilkBatch,
  getParticipant,
  getStep,
  getTotalLots,
  getTotalMilkBatches,
  getTotalSteps,
  removeParticipant,
} from './service'
import { Role } from './types'

const createRoute = (call: Function) => async (req: Request, res: Response) => {
  try {
    const value = await call(req, res)
    res.send(JSON.stringify(value))
  } catch (error) {
    console.log(error)
  }
}

// first steps
export const deployContractRoute = createRoute(deployContract)

// general functions
export const getBlockRoute = createRoute(getBlock)
export const getContractAddressRoute = createRoute(getContractAddress)

// contract variables
export const getAdminRoute = createRoute(getAdmin)
//todo export const getLaboratoryRoute = createRoute(getLaboratory)
export const getTotalLotsRoute = createRoute(getTotalLots)
export const getTotalStepsRoute = createRoute(getTotalSteps)
export const getTotalMilkBatchesRoute = createRoute(getTotalMilkBatches)

// mapping information
export const getLotRoute = createRoute(getLot)
export const getStepRoute = createRoute(getStep)
export const getMilkBatchRoute = createRoute(getMilkBatch)
export const getParticipantRoute = createRoute(getParticipant)

// core functions
export const addMilkBatchRoute = createRoute(addMilkBatch)
export const addLotRoute = createRoute(addLot)
export const addStepRoute = createRoute(addStep)
export const addLabResultRoute = createRoute(addLabResult)
export const addLabRoute = createRoute(addParticipant(Role.Laboratory))
export const addBasicRoute = createRoute(addParticipant(Role.Basic))
export const removeParticipantRoute = createRoute(removeParticipant)
export const changeRoleRoute = createRoute(changeRole)
