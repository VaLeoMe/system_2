import React from 'react'
import InteractionElement from '../InteractionElement'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { FormSkeleton } from '../FormSkeleton'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { FormField } from '../../../types'

export type RemoveParticipantFormValues = {
  address: string
}

const fields: Array<FormField> = [
  { __tag: 'input', name: 'address', type: 'text', placeholder: 'address' }
]

export const RemoveParticipant = () => {
  const { removeParticipant } = useFunctions()
  const formId = 'removeParticipant'

  const formikConfig: FormikConfig<RemoveParticipantFormValues> = {
    initialValues: {
      address: ''
    },
    onSubmit: async (values) => {
      await removeParticipant(values.address)
    },
    validationSchema: Yup.object({
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
      title={'Remove Participant'}
      containsForm={true}
      formId={formId}
    >
      <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
    </InteractionElement>
  )
}
