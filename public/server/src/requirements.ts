import { NextFunction, Request, Response } from 'express'
import { connect } from './providers'
import { Contract } from 'ethers'
import { CheeseChain } from './typechain'
const [provider, wallet, contractAt] = connect()

export const requireContract = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS
    if (contractAddress === undefined) {
      throw new Error('No contract address defined')
    }
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    res.status(428).json({
      error: message,
    })
  }
  req.contractAddress = process.env.CONTRACT_ADDRESS
  next()
}

export const attachContract = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const CheeseChain: Contract = contractAt(
    'CheeseChain',
    process.env.CONTRACT_ADDRESS,
  )
  const cc: CheeseChain = (await CheeseChain.connect(wallet)) as CheeseChain
  req.cc = cc
  next()
}
