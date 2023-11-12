import * as Yup from "yup";

type MyFormAttrs<T extends object> = {
    initialValues: T,
    validationSchema: Yup.ObjectSchema<T>,
    onSubmit: (values: T) => void
}
