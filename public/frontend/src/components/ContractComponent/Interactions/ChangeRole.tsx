import React from 'react'
import InteractionElement from '../InteractionElement'
import { Role, roleNames } from './interactionService'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { FormSkeleton } from '../FormSkeleton'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { FormField } from '../../../types'

const fields: Array<FormField> = [
  { __tag: 'input', type: 'text', name: 'address', placeholder: 'address' },
  {
    __tag: 'select',
    name: 'role',
    label: 'role',
    options: [
      { value: -1, label: 'Select a Role' },
      { value: Role.ViewOnly, label: roleNames[Role.ViewOnly] },
      { value: Role.Basic, label: roleNames[Role.Basic] },
      { value: Role.Laboratory, label: roleNames[Role.Laboratory] },
      { value: Role.MilkProducer, label: roleNames[Role.MilkProducer] }
    ]
  }
]

export type ChangeRoleFormValues = {
  role: Role
  address: string
}

export const ChangeRole = () => {
  const { changeRole } = useFunctions()
  const formId = 'changeRole'

  const formikConfig: FormikConfig<ChangeRoleFormValues> = {
    initialValues: {
      role: -1, // added for our select
      address: ''
    },
    onSubmit: async (values) => {
      await changeRole({ address: values.address, role: values.role })
    },
    validationSchema: Yup.object({
      role: Yup.number()
        .oneOf([0, 1, 2, 3], 'Invalid Job Type')
        .required('Required'),
      address: Yup.string()
        .matches(
          /^0x[a-fA-F0-9]{40}$/,
          'must start with 0x and have 40 characters after it'
        )
        .required('Required')
    })
  }

  return (
    <InteractionElement
      title={'Change Role'}
      containsForm={true}
      formId={formId}
    >
      <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
    </InteractionElement>
  )
}
