import { Formik, FormikConfig, FormikValues } from 'formik'
import { StyledForm } from './styles'
import { MySelect, MyTextInput } from './InteractionElement'
import { FormField } from '../../types'

export const FormSkeleton = <T extends FormikValues,>({
  formikConfig,
  fields,
  id
}: {
  formikConfig: FormikConfig<T>
  fields: Array<FormField>
  id: string
}) => {
  return (
    <Formik
      initialValues={formikConfig.initialValues}
      validationSchema={formikConfig.validationSchema}
      onSubmit={formikConfig.onSubmit}
    >
      <StyledForm id={id}>
        {fields
          .map((field, index) => {
            if (field.__tag === 'input') {
              return (
                <MyTextInput
                  key={index}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              )
            } else if (field.__tag === 'select') {
              return (
                <MySelect key={index} label={field.label} name={field.name}>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </MySelect>
              )
            } else return undefined
          })
          .filter((f) => f !== undefined)}
      </StyledForm>
    </Formik>
  )
}
