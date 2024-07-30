// step description, actor, location, date, time
import { useWeb3React } from '@web3-react/core'
import { format } from 'date-fns'
import { useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import styled from 'styled-components'
import { roleToString, Step } from '../../types'
import { GlobalThemeProps } from '../ConnectWallet'
import { StepMap } from './Map'
import { Provider } from '../../utils/provider'
import { chainIdToBlockExplorer } from '../ConnectWallet/ChainDisplayer'

export const LabResult = ({
  result,
  timestamp
}: {
  result: boolean
  timestamp: number
}) => {
  return (
    <StepWrapper>
      <StepPreview hoverable={false}>
        <StepDate>
          {timestamp === 0
            ? 'Outstanding'
            : format(new Date(parseInt(timestamp.toString()) * 1000), 'PPP')}
        </StepDate>
        <StepDescription className="description">
          Laboratory Result
          {timestamp !== 0 ? (result ? ': Passed' : ': Failed') : ''}
        </StepDescription>
        <FiChevronRight style={{ opacity: 0 }} />
      </StepPreview>
    </StepWrapper>
  )
}

const Detail = ({
  name,
  value,
  url
}: {
  name: string
  value: string
  url?: string
}) => {
  return (
    <DetailWrapper>
      <DetailTitle>{name}</DetailTitle>
      <DetailContent
        hasLink={!!url}
        onClick={url ? () => window.open(url, '_blank') : () => {}}
      >
        {value}
      </DetailContent>
    </DetailWrapper>
  )
}

const DetailWrapper = styled.div`
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 350px) {
    flex: 24px;
  }
`

const DetailTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }: GlobalThemeProps) => theme.text};
  opacity: 0.7;
`

const DetailContent = styled.div<{ hasLink: boolean }>`
  font-size: 14px;
  cursor: ${(props) => (props.hasLink ? 'pointer' : 'default')};
`

const generateExplorerUrl = (
  chainId: number | undefined,
  address: string
): string | undefined => {
  if (chainId === 31337 || chainId === undefined) {
    return undefined
  } else if (!chainId) {
    return process.env.REACT_APP_BLOCK_EXPLORER + address
  } else {
    return chainIdToBlockExplorer[chainId] + address
  }
}

export const ModalStep = ({ stepDetails }: { stepDetails: Step }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { chainId } = useWeb3React<Provider>()

  return (
    <>
      <StepWrapper
        onClick={() => {
          setIsOpen((v) => !v)
        }}
      >
        <StepPreview hoverable>
          <StepDate>
            {format(
              new Date(parseInt(stepDetails.timestamp.toString()) * 1000),
              'PPP'
            )}
          </StepDate>
          <StepDescription>{stepDetails.description}</StepDescription>
          <FiChevronRight
            className={isOpen ? 'chevron-open' : 'chevron-closed'}
          />
        </StepPreview>
        {isOpen && (
          <>
            <StepDetails onClick={(e) => e.stopPropagation()}>
              <Detail
                name="Time"
                value={format(new Date(stepDetails.timestamp * 1000), 'HH:mm')}
              />
              <Detail
                url={generateExplorerUrl(chainId, stepDetails.owner.address)}
                name="Address"
                value={`${stepDetails.owner.address.substring(
                  0,
                  6
                )}...${stepDetails.owner.address.substring(
                  stepDetails.owner.address.length - 4
                )}`}
              />

              <Detail name="Name" value={stepDetails.owner.name} />
              <Detail
                name="Role"
                value={roleToString[stepDetails.owner.role]}
              />
            </StepDetails>
            <StepMap coordinates={stepDetails.coordinates} />
          </>
        )}
      </StepWrapper>
    </>
  )
}

const StepPreview = styled.div<{ hoverable: boolean }>`
  display: flex;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 8px;
  gap: 16px;
  height: 32px;
  :hover {
    background-color: ${(props) =>
      props.hoverable ? props.theme.foreground : ''};
    border-radius: 22px;
  }

  @media screen and (max-width: 500px) {
    gap: 8px;
  }
`

const StepDescription = styled.div`
  flex: 1;
  @media screen and (max-width: 400px) {
    font-size: 14px;
  }

  @media screen and (max-width: 350px) {
    font-size: 12px;
  }
`

const StepDate = styled.div`
  color: ${({ theme }: GlobalThemeProps) => theme.text};
  flex: 1;
  @media screen and (max-width: 400px) {
    font-size: 14px;
  }

  @media screen and (max-width: 350px) {
    font-size: 12px;
  }
`

// role, name, address, time --> location
const StepDetails = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 40px 40px;
  grid-column-gap: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 350px) {
    display: flex;
    flex-direction: column;
  }
`

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 6px 16px;

  @media screen and (max-width: 500px) {
    padding: 6px 4px;
  }

  .chevron-closed {
    transition: transform 0.5s ease;
    color: ${({ theme }: GlobalThemeProps) => theme.text};
  }

  .chevron-open {
    color: ${({ theme }: GlobalThemeProps) => theme.text};
    transition: transform 0.5s ease;
    transform: rotate(90deg);
  }

  .date {
    flex: 0 1 150px;
    color: rgba(0, 0, 0, 0.7);
  }
`
