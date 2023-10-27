import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {Form, Formik} from "formik";
import * as Yup from 'yup'
import ChangePasswordModel from "../../Models/Auth/ChangePasswordModel";
import InputField from "../../Components/Form/InputField";
import {useChangePasswordMutation} from "../../App/Api/AuthApi";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import getAppError from "../../Utilites/getAppError";

const ChangePassword = () => {
    const [change, changeResult] = useChangePasswordMutation()
    const navigator = useAppNavigator()
    const location = useLocation()

    useEffect(() => {
        if (changeResult.isSuccess)
            navigator(location.state?.from ?? '/')
    }, [changeResult.isSuccess])

    const initialValues: ChangePasswordModel & { confirmPassword: string } = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    const validationSchema = Yup.object({
        oldPassword: Yup.string().required('old password is required'),
        confirmPassword: Yup.string().required('confirm password is required')
            .test({
                test: (value, context) => {
                    const newPassword = context.from![0].value.newPassword
                    return value === newPassword
                },
                message: 'confirm password dose not match with the new password'
            }),
        newPassword: Yup.string().required('password is required')
    })
    return (
        <div className={'my-container'}>
            <Formik
                {...{initialValues, validationSchema}}
                onSubmit={change}>
                {({handleSubmit}) => <Form onSubmit={handleSubmit}>
                    {changeResult?.isError && <h3 className={'text-center text-2xl text-red-900'}>
                        <div>{getAppError(changeResult.error)?.code}</div>
                        <div>{getAppError(changeResult.error)?.message}</div>
                    </h3>}
                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <InputField
                            name={'oldPassword'}
                            label={'Old Password'}
                            placeholder={'Old Password...'}/>
                    </div>
                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <InputField
                            name={'newPassword'}
                            label={'New Password'}
                            placeholder={'New Password...'}/>
                    </div>
                    <div className="w-full sm:w-1/2 mx-auto border border-gray-800 p-3 rounded-xl my-3">
                        <InputField
                            name={'confirmPassword'}
                            label={'Confirm Password'}
                            placeholder={'Confirm Password...'}/>
                    </div>

                    <div className="text-center">
                        <button className={'bg-blue-400 p-3 rounded-xl'}>Edit</button>
                    </div>
                </Form>}
            </Formik>
        </div>
    );
};

export default ChangePassword;