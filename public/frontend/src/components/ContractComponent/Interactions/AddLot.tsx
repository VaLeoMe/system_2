import InteractionElement from '../InteractionElement'
import React from 'react'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import { FormSkeleton } from '../FormSkeleton'
import { FormField } from '../../../types'

export type AddStepValues = {
  milkBatchId: string
}

const fields: Array<FormField> = [
  {
    __tag: 'input',
    type: 'text',
    name: 'milkBatchId',
    placeholder: 'Milk Batch Ids (i.e. 1, 2)'
  }
]

export const AddLot = () => {
  const { addLot } = useFunctions()
  const formId = 'addLot'

  const formikConfig: FormikConfig<AddStepValues> = {
    initialValues: {
      milkBatchId: ''
    },
    onSubmit: async (values) => {
      const ids = values.milkBatchId
        .split(',')
        .filter((id) => id !== '')
        .map((id) => parseInt(id.trim()))

      if (ids.includes(NaN)) {
        window.alert('All values must be numbers.')
        return
      }
      await addLot(parseInt(values.milkBatchId))
    },
    validationSchema: Yup.object({
      milkBatchId: Yup.string().required('Required')
    })
  }

  return (
    <InteractionElement title={'Add Lot'} containsForm={true} formId={formId}>
      <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
    </InteractionElement>
  )
}
