import React, {useEffect} from 'react';
import AddStudentModel from "../../App/Models/Student/AddStudentModel";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import MyInputField from "../../Components/Form/MyInputField";
import {MyButton} from "../../Components/Form/MyButton";
import {useAddStudentMutation} from "../../App/Api/StudentApi";
import {MyFormAttrs} from "../../global";
import FormError from "../../Components/Form/FormError";
import getAppError from "../../Utilites/getAppError";
import FromSuccess from "../../Components/Form/FromSuccess";


const AddStudent = () => {
    const [add, addResult] = useAddStudentMutation()

    const myFromAttrs: MyFormAttrs<AddStudentModel & { confirmPassword: string }> = {
        initialValues: {
            department: "",
            firstName: "",
            lastName: "",
            username: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            nationalNumber: ""
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required("first name is required"),
            lastName: Yup.string().required("last name is required"),
            username: Yup.string().required("username is required"),
            phoneNumber: Yup.string().required("phone is required"),
            email: Yup.string().required("email is required"),
            department: Yup.string().required("department is required"),
            nationalNumber: Yup.string().required("national number is required"),
            password: Yup.string()
                .test({
                    message: "The password must has more than 8 characters and at least one small and one capital character and one non-alphabitic character and at least one number",
                    test: (v) =>
                        new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(v!)
                })
                .required("password is required"),
            confirmPassword: Yup.string()
                .test({
                    message: "the confirm password is not the same as the password",
                    test: (v, context) => context.from![0]!.value.password == v
                })
                .required("confirm password is required")
        }),
        onSubmit: (values) => {
            add(values)
        }
    }

    return <div className={'my-container'}>
        {addResult.isError && <FormError error={getAppError(addResult.error)!}/>}
        {addResult.isSuccess && <FromSuccess>Student Added Successfully</FromSuccess>}
        <Formik {...myFromAttrs}>
            <Form>
                <div className={'flex flex-wrap justify-center gap-3'}>
                    <FormFieldWrapper>
                        <MyInputField
                            name={'firstName'}
                            label={'First Name'}
                            placeholder={'First Name...'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'lastName'}
                            label={'Last Name'}
                            placeholder={'Last Name...'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'username'}
                            label={'User Name'}
                            placeholder={'User Name...'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'phoneNumber'}
                            label={'Phone Number'}
                            placeholder={'Phone Number...'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'email'}
                            label={'Email'}
                            placeholder={'Email...'}
                            type={'email'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'nationalNumber'}
                            label={'National Number'}
                            placeholder={'National Number...'}
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
                            name={'password'}
                            label={'Password'}
                            placeholder={'Password...'}
                            type={'password'}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyInputField
                            name={'confirmPassword'}
                            label={'Confirm Password'}
                            placeholder={'Confirm Password...'}
                            type={'password'}
                        />
                    </FormFieldWrapper>
                </div>

                <div className="flex justify-center">
                    <MyButton type={'submit'} className={'w-full sm:w-1/2 md:w-1/3'}>Add</MyButton>
                </div>
            </Form>
        </Formik>
    </div>
};

export default AddStudent;