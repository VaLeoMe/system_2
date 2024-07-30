import { CheeseChain } from '../../src/typechain'

declare global {
  namespace Express {
    export interface Request {
      contractAddress?: string
      cc?: CheeseChain
    }
  }
}
