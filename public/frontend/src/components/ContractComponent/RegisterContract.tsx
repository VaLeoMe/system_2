import React, { MouseEvent, useEffect, useState } from 'react'
import { ethers, Signer } from 'ethers'
import CheeseChainArtifact from '../../artifacts/contracts/CheeseChain.sol/CheeseChain.json'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import { Wrapper } from './styles'
import InteractionElement from './InteractionElement'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { FormSkeleton } from './FormSkeleton'
import { FormField } from '../../types'
import { CheeseChain } from '../../typechain'

export type ContractConnectFormValues = {
  address: string
}

const fields: Array<FormField> = [
  {
    __tag: 'input',
    type: 'text',
    name: 'address',
    placeholder: 'address'
  }
]

const RegisterContract = ({
  setContract
}: {
  setContract: React.Dispatch<React.SetStateAction<CheeseChain | undefined>>
}) => {
  const { library } = useWeb3React<Provider>()
  const [signer, setSigner] = useState<Signer>()

  useEffect((): void => {
    if (!library) {
      setSigner(undefined)
      return
    }

    setSigner(library.getSigner())
  }, [library])

  const handleDeployContract = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!signer) {
      return
    }

    const deployContract = async (signer: Signer): Promise<void> => {
      const CheeseChain = new ethers.ContractFactory(
        CheeseChainArtifact.abi,
        CheeseChainArtifact.bytecode,
        signer
      )

      try {
        const newContractInstance: CheeseChain =
          (await CheeseChain.deploy()) as CheeseChain

        await newContractInstance.deployed()

        setContract(newContractInstance)
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        )
      }
    }

    deployContract(signer)
  }

  const connectContract = async (address: string) => {
    if (!address) return

    const code = await library?.getCode(address)

    if (code === '0x') {
      window.alert(
        'The entered address is not a contract or not deployed on this network'
      )
      return
    }

    const CheeseChain = new ethers.ContractFactory(
      CheeseChainArtifact.abi,
      CheeseChainArtifact.bytecode,
      signer
    )

    setContract((await CheeseChain.attach(address)) as CheeseChain)
  }

  const formId = 'connectContract'

  const formikConfig: FormikConfig<ContractConnectFormValues> = {
    initialValues: {
      address: ''
    },
    onSubmit: async (values) => {
      await connectContract(values.address)
    },
    validationSchema: Yup.object({
      address: Yup.string().matches(
        /^0x[a-fA-F0-9]{40}$/,
        'must start with 0x and have 64 characters after it'
      )
    })
  }

  return (
    <Wrapper>
      <InteractionElement
        title={'Connect to existing contract'}
        foldable={false}
        formId={formId}
        containsForm={true}
      >
        <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
      </InteractionElement>
      <InteractionElement
        title={'Deploy new contract'}
        buttonFunction={handleDeployContract}
        buttonText={'Deploy'}
        foldable={false}
        containsForm={false}
      />
    </Wrapper>
  )
}

export default RegisterContract
