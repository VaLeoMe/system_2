if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express, { Express, Request, Response } from 'express'
import {
  addBasicRoute,
  addLabResultRoute,
  addLabRoute,
  addLotRoute,
  addMilkBatchRoute,
  addStepRoute,
  changeRoleRoute,
  deployContractRoute,
  getAdminRoute,
  getBlockRoute,
  getContractAddressRoute,
  getLotRoute,
  getMilkBatchRoute,
  getParticipantRoute,
  getStepRoute,
  getTotalLotsRoute,
  getTotalMilkBatchesRoute,
  getTotalStepsRoute,
  removeParticipantRoute,
} from './src/routes'
import morgan from 'morgan'
import { attachContract, requireContract } from './src/requirements'

const app: Express = express()
const PORT = process.env.PORT || 3001

const connectContract = [requireContract, attachContract]

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

app.use(express.json())
app.use(morgan('dev'))

const boldOpen = "<strong>";
const boldClose = "</strong>";

app.get('/', (req, res) => {
  const instructions = "These are the GET requests that can be performed in the browser:<br>"
                      + `${boldOpen}/block${boldClose} (fetch the current block number)<br>`
                      + `${boldOpen}/contract${boldClose} (fetch the SC address)<br><br>`
                      
                      + `${boldOpen}/total-milk-batches${boldClose} (fetch the total amount of milk batches stored)<br>`
                      + `${boldOpen}/total-lots${boldClose} (fetch the total amount of lots stored)<br>`
                      + `${boldOpen}/total-steps${boldClose} (fetch the total amount of steps stored)<br>`
                      + `${boldOpen}/admin${boldClose} (fetch the wallet address of the admin)<br><br>`

                      + `${boldOpen}/milk-batches/:id${boldClose} (fetch the information about a specific milk batch by its ID)<br>`
                      + `${boldOpen}/lots/:id${boldClose} (fetch the information about a specific lot by its ID)<br>`
                      + `${boldOpen}/steps/:id${boldClose} (fetch the information about a specific step by its ID)<br>`
                      + `${boldOpen}/participants/:address${boldClose} (fetch the information about a specific participant by their address)<br><br>`
  res.send(instructions);
});

// first steps
app.post('/deploy', deployContractRoute)

// general functions
app.get('/block', getBlockRoute)
app.get('/contract', requireContract, getContractAddressRoute)

// contract variables
app.get('/total-lots', connectContract, getTotalLotsRoute)
app.get('/total-steps', connectContract, getTotalStepsRoute)
app.get('/total-milk-batches', connectContract, getTotalMilkBatchesRoute)
app.get('/admin', connectContract, getAdminRoute)

// mapping information
app.get('/lots/:id', connectContract, getLotRoute)
app.get('/steps/:id', connectContract, getStepRoute)
app.get('/milk-batches/:id', connectContract, getMilkBatchRoute)
app.get('/participants/:address', connectContract, getParticipantRoute)

//core functions
app.post('/add-milk-batch', connectContract, addMilkBatchRoute)
app.post('/add-lot', connectContract, addLotRoute)
app.post('/add-step', connectContract, addStepRoute)
app.post('/add-basic', connectContract, addBasicRoute)
app.post('/add-lab', connectContract, addLabRoute)
app.post('/remove-participant', connectContract, removeParticipantRoute)
app.put('/change-role', connectContract, changeRoleRoute)
app.post('/add-lab-result', connectContract, addLabResultRoute)
