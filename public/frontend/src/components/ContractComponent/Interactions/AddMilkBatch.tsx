import InteractionElement from '../InteractionElement'
import { useFunctions } from '../../../providers/FunctionsProvider'
import { displayLocationAlert, useLocation } from '../../../hooks/useLocation'

export const AddMilkBatch = () => {
  const { addMilkBatch } = useFunctions()
  const { location } = useLocation()

  return (
    <InteractionElement
      containsForm={false}
      title={'Add Milk Batch'}
      buttonFunction={() => {
        if (displayLocationAlert({ location })) return
        addMilkBatch(location)
      }}
    />
  )
}
