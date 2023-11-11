import {useAddSubjectMutation} from "../../App/Api/SubjectApi";
import {Form, Formik} from "formik";
import {AddSubjectModel} from "../../App/Models/Subject/AddSubjectModel";
import * as Yup from 'yup'
import getAppError from "../../Utilites/getAppError";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import MyInputField from "../../Components/Form/MyInputField";
import {MyButton} from "../../Components/Form/MyButton";
import {useEffect} from "react";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {useLocation} from "react-router-dom";

const AddSubject = () => {
    const [add, addResult] = useAddSubjectMutation()
    const navigator = useAppNavigator()
    const loc = useLocation()

    useEffect(() => {
        if (addResult.isSuccess)
            navigator(loc.state?.from ?? 'subject')
    }, [addResult.isSuccess]);

    const initialValues: AddSubjectModel = {
        code: 0,
        name: '',
        department: '',
        hours: 0
    }
    const validationSchema = Yup.object({
        code: Yup.number().required('the code is required'),
        hours: Yup.number().required('the hours is required'),
        department: Yup.string().required('the department is required'),
        name: Yup.string().required('the name is required'),
    })

    return <div className={'my-container min-h-remaining'}>
        {addResult?.isError &&
            <h3 className={'text-center text-2xl text-red-900'}>{getAppError(addResult.error)?.message}</h3>}
        <Formik
            onSubmit={add}
            {...{initialValues, validationSchema}} >
            {({handleSubmit}) => <Form onSubmit={handleSubmit}>
                <FormFieldWrapper>
                    <MyInputField
                        name={'name'}
                        label={'Name'}
                        placeholder={'Name...'}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper>
                    <MyInputField
                        name={'code'}
                        label={'Code'}
                        placeholder={'Code...'}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper>
                    <MyInputField
                        name={'department'}
                        label={'Department'}
                        placeholder={'Department...'}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper>
                    <MyInputField
                        name={'hours'}
                        label={'Hours'}
                        placeholder={'Hours...'}
                    />
                </FormFieldWrapper>

                <div className="flex justify-center">
                    <MyButton type={'submit'} className={'w-10/12 sm:w-1/3'}>Add</MyButton>
                </div>
            </Form>}
        </Formik>
    </div>

};

export default AddSubject