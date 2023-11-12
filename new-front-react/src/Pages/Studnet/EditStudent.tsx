import {useEditStudentMutation, useGetStudentQuery} from "../../App/Api/StudentApi";
import {useParams} from "react-router-dom";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {useEffect, useState} from "react";
import {EditStudentModel} from "../../App/Models/Student/EditStudentModel";
import * as Yup from 'yup'
import getAppError from "../../Utilites/getAppError";
import {Form, Formik} from "formik";
import MyInputField from "../../Components/Form/MyInputField";
import {Spinner} from "@material-tailwind/react";
import FormError from "../../Components/Form/FormError";

const EditStudent = () => {
    const {id} = useParams<{ id: string }>()
    const {data, isSuccess} = useGetStudentQuery(id!)
    const [edit, editResult] = useEditStudentMutation()
    const navigator = useAppNavigator()
    const [initialValues, setInitialValues] = useState<EditStudentModel>({
        id: id!,
        email: '',
        firstname: '',
        phoneNumber: '',
        lastname: ''
    })

    useEffect(() => {
        if (isSuccess)
            setInitialValues(data)
    }, [isSuccess])

    useEffect(() => {
        if (editResult.isSuccess && editResult.data)
            navigator('/Student/' + id)
    }, [editResult.isSuccess])

    const validationSchema = Yup.object({
        email: Yup.string().required('email is required'),
        phoneNumber: Yup.string().required('phone number is required'),
        firstname: Yup.string().required('first name is required'),
        lastname: Yup.string().required('last name is required'),
    })

    return (
        <div className={'my-container'}>
            {editResult?.isError &&
                <h3 className={'text-center text-2xl text-red-900'}>{getAppError(editResult.error)?.message}</h3>}
            {(editResult.isSuccess && editResult.data == false) && <FormError error={{code: 'unknown', message: 'Unknown error try again later'}}/>}
            <Formik
                {...{initialValues, validationSchema}}
                onSubmit={edit}
                enableReinitialize={true}>
                <Form>
                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <MyInputField
                            name={'firstname'}
                            label={'First Name'}
                            placeholder={'First Name...'}/>
                    </div>

                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <MyInputField
                            name={'lastname'}
                            label={'Last Name'}
                            placeholder={'Last Name...'}/>
                    </div>

                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <MyInputField
                            name={'email'}
                            label={'Email'}
                            placeholder={'Email...'}/>
                    </div>

                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <MyInputField
                            name={'phoneNumber'}
                            label={'Phone Number'}
                            placeholder={'Phone Number...'}/>
                    </div>

                    <div className="flex justify-center">
                        {editResult.isLoading ? <Spinner/> :
                            <button className={'bg-blue-400 p-3 rounded-xl'}>Edit</button>}
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default EditStudent;