# CheeseChain x Tête de Moine

<p align="center">
  <a href="https://www.tetedemoine.ch/">
    <img src="https://www.tetedemoine.ch/images/tete-de-moine/logos/logo-tete-de-moine-aop.png">
  </a>
</p>

## Overview

The project consists of three main parts:

- Frontend
- Server
- Chain

The frontend and server can be spun up at the same time using Docker Compose. The chain part is only needed for local development, in which case it must be spun up first.

### Frontend and Server

_Requirements: NodeJs and MetaMask browser extension installed_

1. Clone the source code
2. Deploy the smart contract
3. Create **.env** files inside the /frontend and /server folders, according to the respective **.env.example** files.
4. Make sure the ID of the network that was used to deploy the SC is included in the following files:
  - **/frontend/src/components/ConnectWallet/ChainDisplayer.tsx**
  - **/frontend/src/utils/connectors.ts**
5. Start System 2: **sudo docker compose up --build -d**

That there are two routes implemented for the **Frontend**:

1. **`BASE-URL/:`** Allows to retrieve the lot history via the frontend and is designed for consumers.
2. **`BASE-URL/connect:`** Allows registered participants to interact with the smart contract and requires users to connect a Metamask wallet to the **Frontend**. Participants can be added by the system administrator.

Opening the URL of the **Server** in the browser will display some useful GET-commands.

### Chain

_Requirements: NodeJs installed_

The chain consists of all Smart Contract specific source code (i.e. Smart Contracts, tests, hardhat development environment). No environment variables have to be set to compile, test the smart contract or start a local Hardhat network. But depending on which configurations you add to the hardhat.config.ts file you will need to add API keys, private keys and URL's to the file. In this case you probably want to add this information inside the .env file and reference it in the hardhat.config.ts file.

1. **Install Node modules:** `yarn install`
2. **(Optional) Create .env file:** Follow instructions in `.env.example` file.
3. **Compile Smart Contracts:** This will compile your contracts and copy the artifacts into the frontend folder, where it is necessary in order to deploy the Smart Contract and communicate with it `npx hardhat compile`
4. **Start a local Hardhat network:** `npx hardhat node`

Congratulations, you have a local Ethereum network running, ready to develop and deploy your Smart Contracts on.

If you want to connect a frontend or server to the smart contract run the following commands to generate TypeScript types from the contract ABI and copy them to the frontend/server directory:

1. **Generate types:** `npx hardhat typechain`
2. **Copy types to frontend & server:** `yarn copy:types`

The server additinally needs to know the contract's ABI. For that run `yarn copy:abi`.

#### Deploy the contract via the Hardhat framework:

If you want to connect to the local Hardhat network and interact with it, you must add the network to Metamask first. A guide of how to do this can be found [here](https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node).

1. **Add the network:** In the `hardhat.config.ts` file add the network configurations of the netowork you wish to deploy to. [Here](https://hardhat.org/hardhat-runner/docs/config) is a guide.
2. **(Optional) Create .env file:** Add sensitive information needed in step 1 by to a .env file, otherwise leave it inside the `hardhat.config.ts`.
3. **(Optional) Add Etherscan information in `hardhat.config.ts`:** If you want to verify the Smart Contract via Hardhat, uncomment the _Etherscan_ section and add your information or follow the [instructions](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan).
4. **Deploy the Smart Contract:** `npx hardhat deploy --network <your-network>`. The network names must be equal to those specified in the `hardhat.config.ts` file.
5. **(Optional) Verify the Smart Contract:** `npx hardhat verify --network <your-network> DEPLOYED_CONTRACT_ADDRESS`. Find the instructions [here](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan).

#### To run the test suite:

1. **(Optional) Add GasReporter:** If you want to get a gas report on all Smart Contract functions uncomment _gasReporter_ inside the `hardhat.config.ts` and add you information or follow the [guide](https://www.npmjs.com/package/hardhat-gas-reporter).
2. **Run the Tests:** `npx hardhat test`

_Note: All the environment variables inside the **chain** directory are optional and depend on the configuration of the `hardhat.config.ts` file_

## Authors
- Matteo Gamba
- Valentin Meyer
