import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { clearHistory, selectHistory } from '../../app/lotHistorySlice'
import { closeModal } from '../../app/modalSlice'
import { GlobalThemeProps } from '../ConnectWallet'
import { ModalStep, LabResult } from './ModalStep'

const HistoryModal = () => {
  const dispatch = useDispatch()
  const lotHistory = useSelector(selectHistory)

  return (
    <Wrapper
      onClick={() => {
        dispatch(closeModal())
        dispatch(clearHistory())
      }}
    >
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Explore the history of your cheese</Title>
        {lotHistory && (
          <LabResult
            result={lotHistory.labResult.result}
            timestamp={lotHistory.labResult.timestamp}
          />
        )}
        {lotHistory?.steps.map((h, index) => (
          <ModalStep key={index} stepDetails={h} />
        ))}
      </Modal>
    </Wrapper>
  )
}

export const Title = styled.h2`
  padding-top: 8px;
  padding-left: 8px;
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Modal = styled.div`
  width: 500px;
  background-color: ${({ theme }: GlobalThemeProps) => theme.highlight};
  border-radius: 24px;
  padding: 8px;
  box-shadow: rgb(0 0 0 / 1%) 0ß 0ß 1px, rgb(0 0 0 / 4%) 0ß 4px 8px,
    rgb(0 0 0 / 4%) 0ß 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;

  @media screen and (max-width: 600px) {
    width: 90%;
  }

  @media screen and (max-width: 500px) {
    width: 95%;
  }
`

export default HistoryModal
