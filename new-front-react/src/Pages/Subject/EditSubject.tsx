import {useParams} from "react-router-dom";
import {useEditSubjectMutation, useGetSubjectByCodeQuery} from "../../App/Api/SubjectApi";
import {useEditDoctorMutation, useGetDoctorEditInfoQuery} from "../../App/Api/DoctorApi";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import getAppError from "../../Utilites/getAppError";
import {Form, Formik} from "formik";
import MyInputField from "../../Components/Form/MyInputField";
import {EditSubjectModel} from "../../App/Models/Subject/EditSubjectModel";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import {MyButton} from "../../Components/Form/MyButton";

const EditSubject = () => {
    const {code} = useParams()
    const {data, isSuccess} = useGetSubjectByCodeQuery(+code!)
    const [edit, editResult] = useEditSubjectMutation()
    const navigator = useAppNavigator()
    const [initialValues, setInitialValues] = useState<EditSubjectModel>({
        id: 0,
        code: +code!,
        name: '',
        hours: 0,
        department: ''
    })

    useEffect(() => {
        if (isSuccess)
            setInitialValues({
                id: data.id,
                code: data.code,
                name: data.name,
                hours: data.hours,
                department: data.department
            })
    }, [isSuccess])

    useEffect(() => {
        if (editResult.isSuccess)
            navigator('/Subject/' + code)
    }, [editResult.isSuccess])

    const validationSchema = Yup.object({
        code: Yup.number().required('the code is required'),
        hours: Yup.number().required('the hours is required'),
        department: Yup.string().required('the department is required'),
        name: Yup.string().required('the name is required'),
    })

    return (
        <div className={'my-container'}>
            {editResult?.isError &&
                <h3 className={'text-center text-2xl text-red-900'}>{getAppError(editResult.error)?.message}</h3>}
            <Formik
                {...{initialValues, validationSchema}}
                onSubmit={edit}
                enableReinitialize={true}>
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
                        <MyButton type={'submit'} className={'w-10/12 sm:w-1/3'}>Edit</MyButton>
                    </div>
                </Form>}
            </Formik>
        </div>
    );
};

export default EditSubject;