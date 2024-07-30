import React from 'react'
import InteractionElement from '../InteractionElement'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { FormSkeleton } from '../FormSkeleton'
import { FormField } from '../../../types'
import { displayLocationAlert, useLocation } from '../../../hooks/useLocation'

export type AddStepValues = {
  lotNumber: string
  description: string
}

const fields: Array<FormField> = [
  {
    __tag: 'input',
    type: 'number',
    name: 'lotNumber',
    placeholder: 'Lot number'
  },
  {
    __tag: 'input',
    type: 'text',
    name: 'description',
    placeholder: 'description'
  }
]

export const AddStep = () => {
  const { addStep } = useFunctions()
  const { location } = useLocation()
  const formId = 'addStep'

  const formikConfig: FormikConfig<AddStepValues> = {
    initialValues: {
      lotNumber: '',
      description: ''
    },
    onSubmit: async (values) => {
      if (displayLocationAlert({ location })) return
      await addStep(parseInt(values.lotNumber), values.description, location!)
    },
    validationSchema: Yup.object({
      lotNumber: Yup.number().required('Required'),
      description: Yup.string().max(100, 'Must be 100 characters or less')
    })
  }

  return (
    <InteractionElement title={'Add Step'} containsForm={true} formId={formId}>
      <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
    </InteractionElement>
  )
}
