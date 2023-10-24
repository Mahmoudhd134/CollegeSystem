import React, {FormEvent, useEffect, useRef, useState} from "react";
import {useChangePasswordMutation} from "../../App/Api/AuthApi";
import {useLocation, useNavigate} from "react-router-dom";
import useGetAppError from "../../Hookes/useGetAppError";

const ChangePassword = () => {
    const oldPass = useRef() as React.MutableRefObject<HTMLInputElement>
    const newPass = useRef() as React.MutableRefObject<HTMLInputElement>
    const confirmNewPass = useRef() as React.MutableRefObject<HTMLInputElement>
    const [change, changeResult] = useChangePasswordMutation()
    const [err, setErr] = useState('')
    const navigator = useNavigate()
    const loc = useLocation()

    useEffect(() => {
        if (changeResult.isSuccess)
            navigator(loc.state?.from ?? '/')
    }, [changeResult.isSuccess])


    const validatePassword = (p: string) => {
        const errors = [];
        if (p.length < 8) {
            errors.push("Your password must be at least 8 characters");
        }
        if (p.search(/[a-z]/i) < 0) {
            errors.push("Your password must contain at least one letter.");
        }
        if (p.search(/[0-9]/) < 0) {
            errors.push("Your password must contain at least one digit.");
        }
        if (errors.length > 0) {
            setErr(errors.join(", "));
            return false
        }
        setErr('')
        return true
    }
    const validateConfirmPassword = (p: string) => {
        const errors = [];
        if (p != newPass.current.value) {
            errors.push("Confirm Password Must Be As The New Password");
        }
        if (errors.length > 0) {
            setErr(errors.join(", "));
            return false
        }
        setErr('')
        return true
    }


    const changeHandler = (e: FormEvent) => {
        e.preventDefault()
        change({
            newPassword: newPass.current.value,
            oldPassword: oldPass.current.value
        })
    }

    return (
        <main>
            <div className="container">
                <div className="row justify-content-center pt-5">
                    <form onSubmit={changeHandler} className='col-12 col-sm-11 col-md-8 col-lg-6'>
                        <div className="d-flex flex-column justify-content-center">
                            {err.length > 0 && <h5 className="text-center text-danger">{err}</h5>}
                            {changeResult.isError &&
                                <h5 className="text-center text-danger">{useGetAppError(changeResult.error)?.message}</h5>}
                            <div>
                                <label htmlFor="oldPass" className='col-form-label'>Old Password</label>
                                <input type="password" id='oldPass' className='form-control' ref={oldPass}/>
                            </div>
                            <div>
                                <label htmlFor="newPass" className='col-form-label'>New Password</label>
                                <input type="password" id='newPass' className='form-control' ref={newPass}
                                       onChange={e => validatePassword(e.currentTarget.value)}/>
                            </div>
                            <div>
                                <label htmlFor="confirmNewPass" className='col-form-label'>Confirm New
                                    Password</label>
                                <input type="password" id='confirmNewPass' className='form-control' ref={confirmNewPass}
                                       onChange={e => validateConfirmPassword(e.currentTarget.value)}/>
                            </div>
                            <div className='text-center mt-3'>
                                <button className='btn btn-outline-primary'>Chagne</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ChangePassword;