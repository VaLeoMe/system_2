import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import { ethers } from 'ethers'
import styled from 'styled-components'

export const Balance = (): ReactElement => {
  const { account, library, chainId } = useWeb3React<Provider>()

  const [balance, setBalance] = useState<ethers.BigNumber>()

  useEffect(() => {
    if (typeof account === 'undefined' || account === null || !library) {
      return
    }

    let stale = false

    async function getBalance(
      library: Provider,
      account: string
    ): Promise<void> {
      const balance: ethers.BigNumber = await library.getBalance(account)

      try {
        if (!stale) {
          setBalance(balance)
        }
      } catch (error: any) {
        if (!stale) {
          setBalance(undefined)

          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          )
        }
      }
    }

    getBalance(library, account)

    // create a named balancer handler function to fetch the balance each block. in the
    // cleanup function use the function name to remove the listener
    const getBalanceHandler = (): void => {
      getBalance(library, account)
    }

    library.on('block', getBalanceHandler)

    // cleanup function
    return (): void => {
      stale = true
      library.removeListener('block', getBalanceHandler)
      setBalance(undefined)
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <Wrapper balance={balance}>
      <span>
        {balance === null
          ? 'Error'
          : balance
          ? `${Math.round(+ethers.utils.formatEther(balance) * 1e4) / 1e4} ETH`
          : ''}
      </span>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ balance: ethers.BigNumber | undefined }>`
  padding-left: 12px;
  padding-right: 8px;
  display: ${(props) =>
    props.balance === null ? 'none' : props.balance ? 'block' : 'none'};

  @media screen and (max-width: 600px) {
    display: none;
  }
`
