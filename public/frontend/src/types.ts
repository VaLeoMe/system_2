import { Coordinates } from './utils/location'

export type SelectOption = {
  value: string | number
  label: string
}

export type FormInputField = {
  __tag: 'input'
  type: 'number' | 'text'
  name: string
  placeholder: string
}

export type FormSelectField = {
  __tag: 'select'
  label: string
  name: string
  options: Array<SelectOption>
}

export type FormField = FormInputField | FormSelectField

export type Lot = {
  testResult: {
    result: boolean
    timestamp: any
  }
  lastStep: number
}

export type LotHistory = {
  lotNumber: number
  steps: Array<Step>
  labResult: {
    result: boolean
    timestamp: number
  }
}

export type Participant = {
  name: string
  role: Role
  address: string
}

export type Step = {
  owner: Participant
  timestamp: number
  coordinates: Coordinates
  description: string
}

export enum Role {
  ViewOnly,
  Basic,
  Laboratory,
  MilkProducer,
  Administrator
}

export const roleToString = {
  [Role.ViewOnly]: 'View Only',
  [Role.Basic]: 'Basic',
  [Role.Laboratory]: 'Laboratory',
  [Role.MilkProducer]: 'MilkProducer',
  [Role.Administrator]: 'Administrator'
}

export type User = {
  name?: string
  role: Role
}
