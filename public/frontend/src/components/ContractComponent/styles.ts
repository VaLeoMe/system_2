import styled from 'styled-components'
import { GlobalThemeProps } from '../ConnectWallet'
import { Form } from 'formik'

export const Wrapper = styled.div`
  width: 500px;
  background-color: ${({ theme }: GlobalThemeProps) => theme.highlight};
  border-radius: 24px;
  padding: 8px;
  box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px,
    rgb(0 0 0 / 4%) 0 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;

  @media screen and (max-width: 600px) {
    width: 90%;
  }

  @media screen and (max-width: 500px) {
    width: 95%;
  }
`

export const InteractionWrapper = styled.div`
  .is-closed {
    display: none;
  }

  .is-open {
    display: flex;
    flex-direction: column;
    gap: 8px;
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

  .error {
    color: red;
    font-size: 12px;
  }

  .title {
    padding: 6px 16px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    :hover {
      background-color: ${({ theme }: GlobalThemeProps) => theme.foreground};
      border-radius: 22px;
    }
  }
`

export const TitleContainer = styled.label`
  font-size: 16px;
`

export const InputContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }: GlobalThemeProps) => theme.foreground};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 1rem;

  .error {
    color: red;
    font-size: 12px;
  }
`

export const StyledInput = styled.input`
  background-color: transparent;
  flex: 1;
  border: none;
  font-size: 22px;
  color: ${({ theme }: GlobalThemeProps) => theme.text};
`

export const StyledSelect = styled.select`
  width: 100%;
  height: 100%;
  background-color: transparent;

  flex: 1;
  border: none;
  font-size: 22px;
  color: ${({ theme }: GlobalThemeProps) => theme.text};
`

export const Button = styled.button`
  background-color: ${({ theme }: GlobalThemeProps) => theme.primary};
  border: none;
  font-size: 20px;
  color: ${({ theme }: GlobalThemeProps) => theme.primaryText};
  padding: 0 8px;
  border-radius: 12px;
  min-height: 32px;
  margin: 0 8px 16px;
  :hover {
    background-color: ${({ theme }: GlobalThemeProps) => theme.primaryHover};
  }
`

export const TestResultWrapper = styled.div`
  flex: 0 0 64px;
  height: 32px;
  display: flex;
`

export const TestResultElement = styled.button<{
  result: boolean
  testResult: boolean
}>`
  border: none;
  border-radius: ${(props) =>
    props.result ? '12px 0 0 12px' : '0 12px 12px 0'};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 20px;
  color: ${({ theme }: GlobalThemeProps) => theme.primaryText};
  background-color: ${({ theme }: GlobalThemeProps) => theme.primary};
`

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
