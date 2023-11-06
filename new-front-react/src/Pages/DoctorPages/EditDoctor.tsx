import {Formik, Form} from "formik";
import * as Yup from 'yup'
import {EditDoctorModel} from "../../App/Models/Doctor/EditDoctorModel";
import {useParams} from "react-router-dom";
import MyInputField from "../../Components/Form/MyInputField";
import {useEditDoctorMutation, useGetDoctorEditInfoQuery} from "../../App/Api/DoctorApi";
import {useEffect, useState} from "react";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import getAppError from "../../Utilites/getAppError";

const EditDoctor = () => {
    const {id} = useParams<{ id: string }>()
    const {data, isSuccess} = useGetDoctorEditInfoQuery(id!)
    const [edit, editResult] = useEditDoctorMutation()
    const navigator = useAppNavigator()
    const [initialValues, setInitialValues] = useState<EditDoctorModel>({
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
        if (editResult.isSuccess)
            navigator('/doctor/' + id)
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
            <Formik
                {...{initialValues, validationSchema}}
                onSubmit={edit}
                enableReinitialize={true}>
                {({handleSubmit}) => <Form onSubmit={handleSubmit}>
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

                    <div className="text-center">
                        <button  className={'bg-blue-400 p-3 rounded-xl'}>Edit</button>
                    </div>
                </Form>}
            </Formik>
        </div>
    );
};

export default EditDoctor;