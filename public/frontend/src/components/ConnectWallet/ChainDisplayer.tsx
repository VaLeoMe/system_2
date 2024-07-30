import React, { ReactElement } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Provider } from '../../utils/provider'
import styled from 'styled-components'
import { GlobalThemeProps } from './index'

const Networks: Record<number, string> = {
  1: 'Ethereum',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  137: 'Polygon',
  1297: 'Private',
  31337: 'Hardhat',
  80001: 'Mumbai'
}

export const chainIdToBlockExplorer: Record<number, string | undefined> = {
  1: 'https://etherscan.io/address/',
  3: 'https://ropsten.etherscan.io/address/',
  4: 'https://rinkeby.etherscan.io/address/',
  5: 'https://rinkeby.etherscan.io/address/',
  42: 'https://kovan.etherscan.io/address/',
  137: 'https://polygonscan.com/address/',
  1297: 'https://rpc-cheesechain.comsyslab.xyz',
  80001: 'https://mumbai.polygonscan.com/address',
  31337: undefined // no block explorer
}

const chainIdToLogo = (id: number) => {
  switch (id) {
    case 31337:
      return '/hardhat-logo.png'
    case 80001 || 137:
      return '/polygon-logo.png'
    default:
      return '/ETHLogo.png'
  }
}

export const ChainDisplayer = (): ReactElement => {
  const { chainId } = useWeb3React<Provider>()

  return chainId ? (
    <Wrapper>
      <img
        style={{ height: 20, width: 20, marginRight: 8 }}
        src={chainIdToLogo(chainId)}
        alt={'ETHLogo'}
      />
      <span>{Networks[chainId]}</span>
    </Wrapper>
  ) : (
    <></>
  )
}

const Wrapper = styled.div`
  background-color: ${({ theme }: GlobalThemeProps) => theme.highlight};
  border-radius: 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  @media screen and (max-width: 1000px) {
    display: none;
  }
`
