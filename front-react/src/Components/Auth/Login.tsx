import {useFormik} from "formik";
import * as Yup from 'yup'
import {useLoginMutation} from "../../App/Api/AuthApi";
import LoginModel from "../../Models/Auth/LoginModel";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {baseApi} from "../../App/Api/BaseApi";
import {setCredentials} from "../../Feutures/Auth/authSlice";
import React, {useEffect, useRef, useState} from "react";
import useGetAppError from "../../Hookes/useGetAppError";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'

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
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderRadius: '30px',
    padding: '5px 10px'


};
const Login = () => {
    const [login, result] = useLoginMutation()
    const dispatch = useAppDispatch()
    const navigator = useNavigate()
    const {state} = useLocation()
    const [seePass, setSeePass] = useState(false)
    const stayLogin = useRef() as React.MutableRefObject<HTMLInputElement>
    const formik = useFormik<LoginModel>({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup
                .string()
                .max(20, 'the username can not exceed 20 character')
                .required('the username can not be empty'),

            password: Yup
                .string()
                .required('the password can not be empty'),
        }),
        onSubmit: (values) =>
            login(values)
    })

    useEffect(() => {
        if (result.isSuccess) {
            dispatch(baseApi.util.resetApiState())
            dispatch(setCredentials(result.data!))
            localStorage.setItem('stayLogin', JSON.stringify(stayLogin.current.checked))
            if (result.data.roles?.some(r => r.toLowerCase() == 'doctor'))
                navigator('/doctor/')
            else
                navigator(state?.from ?? '/doctor/list/0')
        }
    }, [result.isSuccess])

    return (
        <form onSubmit={formik.handleSubmit}
              className={`border border-3 rounded rounded-3 shadow-lg d-flex flex-column justify-content-center p-5 align-self-center`}
              style={{height: 'fit-content'}}>

            <p className={'text-center h5 text-danger'}>{result.isError && useGetAppError(result.error)?.message}</p>
            <div>
                <label
                    className={`d-block col-form-label ${formik.touched.username && formik.errors.username ? 'text-danger' : 'text-black'}`}
                    htmlFor="name"
                    style={{fontFamily: 'Roboto'}}>
                    {formik.touched.username && formik.errors.username ? formik.errors.username : 'Name'}
                </label>

                <input type="text"
                       id={'name'}
                       value={formik.values.username}
                       name={'username'}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       className={`form-control ${formik.touched.username && formik.errors.username ? 'border-danger' : ''}`}
                       style={styleInput}
                />
            </div>

            <div className={'my-4'}>

                <label
                    className={`d-block col-form-label ${formik.touched.password && formik.errors.password ? 'text-danger' : 'text-black'}`}
                    htmlFor="pass"
                    style={{fontFamily: 'Roboto'}}>

                    {formik.touched.password && formik.errors.password ? formik.errors.password : 'Password'}
                </label>

                <div className="position-relative">
                    <input type={seePass ? 'text' : 'password'}
                           id={'pass'}
                           value={formik.values.password}
                           name={'password'}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           className={`form-control ${formik.touched.password && formik.errors.password ? 'border-danger' : ''}`}
                           style={styleInput}

                    />
                    <span onClick={e => setSeePass(p => !p)}
                          className="position-absolute top-50 end-0 translate-middle-y me-2"
                          style={{cursor: 'pointer'}}
                    >
                        {seePass ?
                            <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/>}
                    </span>
                </div>


            </div>

            <div className="my-4">
                <input type="checkbox"
                       id="presistence"
                       className="form-check-input"
                       ref={stayLogin}
                />

                <label htmlFor="presistence" className="form-check-label ms-2">Stay Login</label>
            </div>

            <button className={'w-50 align-self-center btn'} style={stylebtn}>Sign in</button>
        </form>
    );
};

export default Login;