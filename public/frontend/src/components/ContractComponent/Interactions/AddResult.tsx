import React from 'react'
import InteractionElement from '../InteractionElement'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { FormSkeleton } from '../FormSkeleton'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { FormField } from '../../../types'

type AddResultValues = {
  lotNumber: string
  result: boolean
}

const fields: Array<FormField> = [
  {
    __tag: 'input',
    type: 'number',
    name: 'lotNumber',
    placeholder: '<LotNumber>'
  },
  {
    __tag: 'select',
    label: 'result',
    name: 'result',
    options: [
      { value: 'true', label: 'Lab Test Passed' },
      { value: 'false', label: 'Lab Test Failed' }
    ]
  }
]

export const AddResult = () => {
  const { addResult } = useFunctions()
  const formId = 'addResult'

  const formikConfig: FormikConfig<AddResultValues> = {
    initialValues: {
      lotNumber: '',
      result: false
    },
    onSubmit: async (values) => {
      await addResult(parseInt(values.lotNumber), values.result)
    },
    validationSchema: Yup.object({
      lotNumber: Yup.number().required('Required'),
      result: Yup.boolean().required('Required')
    })
  }

  return (
    <InteractionElement
      title={'Add Lab Results'}
      formId={formId}
      containsForm={true}
    >
      <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
    </InteractionElement>
  )
}
