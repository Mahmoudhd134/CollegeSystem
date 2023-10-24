import * as Yup from 'yup'
import {useEffect, useState} from 'react'
import {AddDoctorModel} from '../../Models/Doctor/AddDoctorModel'
import {useFormik} from 'formik'
import {useAddDoctorMutation} from '../../App/Api/DoctorApi'
import useGetAppError from '../../Hookes/useGetAppError'
import {BASE_URL} from "../../App/Api/BaseApi";

const stylebtn = {
    backgroundImage: 'linear-gradient(90deg, #000082, #6942ef, #6554c0, #008cff, #000082, #6942ef)',
    color: 'white',
    fontFamily: 'cursive',
    borderRadius: '30px',
    border: 'none',
    backgroundSize: '400%',
    backgroundPosition: '0% 0%',

};
const styleInput = {
    backgroundColor: "white",
    borderColor: '#555',
    fontFamily: 'lato',
    borderWidth: '0.3px',
    borderStyle: 'thin',
    borderRadius: '30px',
    padding: '6px 20px',
    margin: '10px 5px'


};
const styletext = {
    fontFamily: 'Roboto',
    fontSize: '18px',
    margin: '2px'

};
const AddDoctor = () => {
    const [add, addResult] = useAddDoctorMutation()
    const [validName, setValidName] = useState(true)
    //@ts-ignore
    const formik = useFormik<AddDoctorModel & { confirmPassword: string }>({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            nationalNumber: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('first name is required'),
            lastName: Yup.string().required('last name is required'),
            username: Yup.string().required('username is required'),
            phoneNumber: Yup.string().required('phone is required'),
            email: Yup.string().required('email is required'),
            password: Yup.string()
                .test({
                    message: 'The password must has more than 8 characters and at least one small and one capital character and one non-alphabitic character and at least one number',
                    test: (v) =>
                        new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(v!)
                })
                .required('password is required'),
            confirmPassword: Yup.string()
                .test({
                    message: 'the confirm password is not the same as the password',
                    test: (v) => formik.values.password == v
                })
                .required('confirm password is required')
        }),
        onSubmit: (values: AddDoctorModel) => {
            add(values)
        }
    })

    useEffect(() => {
        if (!validName) {
            console.log('setting errors')
            formik.setErrors({...formik.errors, username: formik.errors.username + '\nthe username is already token'})
        }
    }, [validName])

    useEffect(() => {
        if (formik.values.username.trim().length == 0)
            return

        fetch(`${BASE_URL}auth/isvalidusername/` + formik.values.username)
            .then(r => r.json())
            .then(r => setValidName(r));
    }, [formik.values.username])

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit}
                  className={'d-flex flex-column p-5 mx-auto border border-3 rounded rounded-3 col-lg-8 mt-3' +
                      ' shadow' +
                      ' gap-2'}
                  style={{height: 'fit-content'}}>
                <p className={'text-center h5 text-danger'}>{addResult.isError && useGetAppError(addResult.error)?.message}</p>
                <p className={'text-center h5 text-primary'}>{addResult.isSuccess && 'Registration Complete Successfully'}</p>
                <h3 style={{fontFamily: "Roboto", color: "#000082", textAlign: "center", marginBottom: "20px"}}>Add new
                    Doctor</h3>
                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.firstName && formik.errors.firstName) && 'border-1 border-danger'}`}
                            id={'fname'}
                            name={'firstName'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                            style={styleInput}
                            placeholder="First Name"
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.lastName && formik.errors.lastName) && 'border-1' +
                            ' border-danger'}`}
                            id={'lname'}
                            name={'lastName'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                            style={styleInput}
                            placeholder="Last Name"
                        />
                    </div>
                </div>

                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.username && formik.errors.username) && 'border-1' +
                            ' border-danger'}`}
                            id={'uname'}
                            name={'username'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            style={styleInput}
                            placeholder="Username"
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.phoneNumber && formik.errors.phoneNumber) && 'border-1' +
                            ' border-danger'}`}
                            id={'phone'}
                            name={'phoneNumber'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                            style={styleInput}
                            placeholder="Phone Number"
                        />
                    </div>
                </div>

                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.nationalNumber && formik.errors.nationalNumber) && 'border-1' +
                            ' border-danger'}`}
                            id={'nationNum'}
                            name={'nationalNumber'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nationalNumber}
                            style={styleInput}
                            placeholder="National Number"
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="email"
                            className={`form-control ${(formik.touched.email && formik.errors.email) && 'border-1' +
                            ' border-danger'}`}
                            id={'email'}
                            name={'email'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            style={styleInput}
                            placeholder="Email"
                        />
                    </div>
                </div>


                <div className={'row d-flex justify-content-between align-items-start'}>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="password"
                            className={`form-control ${(formik.touched.password && formik.errors.password) && 'border-1' +
                            ' border-danger'}`}
                            id={'pass'}
                            name={'password'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            style={styleInput}
                            placeholder="Password"
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        <input
                            type="password"
                            className={`form-control ${(formik.touched.confirmPassword && formik.errors.confirmPassword) && 'border-1' +
                            ' border-danger'}`}
                            id={'con-pass'}
                            name={'confirmPassword'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            style={styleInput}
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>

                <button className={'btn  w-50 align-self-center mt-3'} style={stylebtn}>Signup</button>
            </form>
        </div>
    );
}

export default AddDoctor