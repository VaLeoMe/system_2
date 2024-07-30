import { Response } from 'express'

export const rpcErrors = {
  participantExists: 'A participant with this address exists already',
  participantDoesntExist: 'A participant with this address does not exist',
  lotExists: 'The lot with the given number does not exist!',
  onlyAdmin: 'This function is only callable by an admin!',
  onlyBasic: 'Msg.sender is not basic or admin',
  onlyLab: 'Msg.sender is not lab or admin',
  onlyMilkProducer: 'This function is only callable by a milk producer!',
  notEmptyAddress: 'The address cannot be a 0 address!',
  onlyValidMilkBatch: 'Please provide only existing milk batch identifiers',
}

export const handleRpcErrors = (
  error: any,
  errorMessages: Array<string>,
  res: Response,
) => {
  errorMessages.forEach((e) => {
    try {
      if (error.error.reason.includes(e)) {
        res.status(400).json({ error: e })
        return
      }
    } catch (e) {}
  })
  res.status(400).json({ error: error.message })
}
