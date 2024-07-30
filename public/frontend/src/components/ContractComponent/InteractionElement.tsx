import React, { ReactNode, useState } from 'react'
import {
  Button,
  InputContainer,
  InteractionWrapper,
  StyledInput,
  StyledSelect,
  TitleContainer
} from './styles'
import { FiChevronRight } from 'react-icons/fi'
import { useField } from 'formik'

type FormIsChildProps = {
  containsForm: true
  title: string
  formId: string
  children: ReactNode
  foldable?: boolean
  buttonText?: string
}

type NoChildProps = {
  containsForm: false
  title: string
  buttonFunction: (params: any) => void
  foldable?: boolean
  buttonText?: string
}

const InteractionElement = (props: FormIsChildProps | NoChildProps) => {
  const isFoldable = props.foldable === undefined || props.foldable
  const [isOpen, setIsOpen] = useState<boolean>(!isFoldable)
  return (
    <InteractionWrapper>
      <div
        className={'title'}
        onClick={() => isFoldable && setIsOpen((v) => !v)}
      >
        <TitleContainer>{props.title}</TitleContainer>
        {isFoldable && (
          <FiChevronRight
            className={isOpen ? 'chevron-open' : 'chevron-closed'}
          />
        )}
      </div>
      <div className={isOpen ? 'is-open' : 'is-closed'}>
        {props.containsForm && props.children}
        {props.containsForm ? (
          <Button type={'submit'} form={props.formId}>
            {props.buttonText ? props.buttonText : props.title}
          </Button>
        ) : (
          <Button onClick={props.buttonFunction}>
            {props.buttonText ? props.buttonText : props.title}
          </Button>
        )}
      </div>
    </InteractionWrapper>
  )
}

export const MySelect = (props: {
  label: string
  name: string
  children: ReactNode
}) => {
  const [field, meta] = useField(props)
  return (
    <InteractionWrapper>
      <InputContainer>
        <StyledSelect {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </InputContainer>
    </InteractionWrapper>
  )
}

export const MyTextInput = (props: {
  name: string
  type: string
  placeholder: string
}) => {
  const [field, meta] = useField(props.name)
  return (
    <InteractionWrapper>
      <InputContainer>
        <StyledInput className="text-input" {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </InputContainer>
    </InteractionWrapper>
  )
}

export default InteractionElement
