import { Wrapper } from './ContractComponent/styles'
import { FormikConfig } from 'formik'
import * as Yup from 'yup'
import InteractionElement from './ContractComponent/InteractionElement'
import { useContract } from '../providers/ContractProvider'
import { FormSkeleton } from './ContractComponent/FormSkeleton'
import { FormField } from '../types'
import { useDispatch } from 'react-redux'
import { openModal } from '../app/modalSlice'
import { useFunctions } from '../providers/FunctionsProvider'
import { setHistory } from '../app/lotHistorySlice'

type GetLotFormValues = {
  lotNumber: string
}

const fields: Array<FormField> = [
  {
    __tag: 'input',
    type: 'number',
    name: 'lotNumber',
    placeholder: 'Lot number'
  }
]

export const LotHistory = () => {
  const contract = useContract()
  const dispatch = useDispatch()
  const { getDetails } = useFunctions()

  const formId = 'getLotDetails'

  const formikConfig: FormikConfig<GetLotFormValues> = {
    initialValues: {
      lotNumber: ''
    },
    onSubmit: async (values) => {
      const lot = await contract.getLot(parseInt(values.lotNumber))
      if (lot.timestamp.toNumber() === 0) {
        window.alert('This lot number has not been initialized yet.')
      } else {
        const details = await getDetails(parseInt(values.lotNumber))
        dispatch(openModal())
        dispatch(setHistory(details))
      }
    },
    validationSchema: Yup.object({
      lotNumber: Yup.number().required('Required')
    })
  }

  return (
    <Wrapper style={{ marginTop: 40 }}>
      <InteractionElement
        title={'Get Lot Details'}
        foldable={false}
        containsForm={true}
        formId={formId}
      >
        <FormSkeleton formikConfig={formikConfig} fields={fields} id={formId} />
      </InteractionElement>
    </Wrapper>
  )
}