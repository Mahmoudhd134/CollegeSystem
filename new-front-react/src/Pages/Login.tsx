import {useFormik} from 'formik'
import * as yup from 'yup'
import LoginModel from '../App/Models/Auth/LoginModel'
import {useLoginMutation} from '../App/Api/AuthApi'
import {MutableRefObject, useEffect, useRef} from 'react'
import useAppDispatch from '../Hookes/useAppDispatch'
import {setCredentials} from '../Feutures/Auth/authSlice'
import useAppNavigator from "../Hookes/Navigation/useAppNavigator";
import getAppError from "../Utilites/getAppError";
import {useLocation} from "react-router-dom";

const Login = () => {
    const [login, loginResult] = useLoginMutation()
    const stayLogin = useRef() as MutableRefObject<HTMLInputElement>
    const dispatch = useAppDispatch()
    const navigator = useAppNavigator()
    const loc = useLocation()

    const loginForm = useFormik<LoginModel>({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: yup.object({
            username: yup.string().required('username is required'),
            password: yup.string().required('password is required')
        }),
        onSubmit: (values) => login(values)
    })

    useEffect(() => {
        if (loginResult.isSuccess == false)
            return

        dispatch(setCredentials(loginResult.data))
        localStorage.setItem('stayLogin', stayLogin.current.checked ? 'true' : 'false')
        const isInRole = ((roles: string[] | null) => (role: string) =>
            roles?.some(r => r.toLowerCase() === role.toLowerCase()))(loginResult.data.roles)

        if (loc.state?.from) {
            navigator(loc.state.from)
            return
        }
        if (isInRole('admin')) navigator('/AdminDashboard')
        if (isInRole('doctor')) navigator('/Doctor/me')
        if (isInRole('student')) navigator('/Student/me')

    }, [loginResult.isSuccess])

    return (
        <div className='min-h-remaining flex justify-center items-center p-4'>
            <div className='w-full sm:w-3/4 md:w-1/2 xl:w-1/3'>
                <form onSubmit={loginForm.handleSubmit}
                      className='border-2 border-blue-500 rounded-xl p-3 w-full mx-auto flex flex-col items-center'>
                    {loginResult.isError &&
                        <div
                            className="bg-blue-200 w-full text-center text-xl p-3 rounded-2xl text-red-900">{getAppError(loginResult.error)?.message}</div>}

                    <div>
                        <label htmlFor="username" className='block my-1 w-fit'>
                            {(loginForm.touched.username && loginForm.errors.username) ?
                                <span className='text-red-700'>{loginForm.errors.username}</span> :
                                'Username'}
                        </label>
                        <input
                            type="text"
                            name='username'
                            id='username'
                            value={loginForm.values.username}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                            className='border-2 border-blue-400 rounded-2xl p-1 bg-blue-100 focus:shadow foucs:shadow-blue-400'
                        />
                    </div>

                    <div className={'my-1'}>
                        <label htmlFor="password" className='block my-1 w-fit'>
                            {(loginForm.touched.password && loginForm.errors.password) ?
                                <span className='text-red-700'>{loginForm.errors.password}</span> :
                                'Password'}
                        </label>
                        <input
                            type="password"
                            name='password'
                            id='password'
                            value={loginForm.values.password}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                            className='border-2 border-blue-400 rounded-2xl p-1 bg-blue-100 focus:shadow foucs:shadow-blue-400'
                        />
                    </div>

                    <div className={'flex items-center gap-1'}>
                        <input
                            ref={stayLogin}
                            className={"w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded-4xl focus:ring-blue-500"}
                            id={'stayLogin'}
                            type="checkbox"/>
                        <label htmlFor="stayLogin">Stay Login</label>
                    </div>

                    <div>
                        <button
                            className='bg-blue-500 w-32 h-12 rounded-2xl border-2 border-blue-100 my-2 hover:-translate-y-1 hover:bg-blue-600 focus:bg-blue-800'>Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login