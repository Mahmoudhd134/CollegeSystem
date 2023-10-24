import React, {useEffect} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {EditDoctorModel} from "../../Models/Doctor/EditDoctorModel";
import {useEditDoctorMutation, useGetDoctorEditInfoQuery} from "../../App/Api/DoctorApi";
import useGetAppError from "../../Hookes/useGetAppError";
import {useFormik} from "formik";
import * as Yup from "yup";

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
const EditDoctor = () => {
    const {id} = useParams()
    const navigator = useNavigate()
    const loc = useLocation()
    const {data, isError, error, isFetching} = useGetDoctorEditInfoQuery(id!)
    const [edit, result] = useEditDoctorMutation()

    const formik = useFormik<EditDoctorModel>({
        initialValues: {
            id: '',
            firstname: '',
            lastname: '',
            phoneNumber: '',
            email: '',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('first name is required'),
            lastname: Yup.string().required('last name is required'),
            phoneNumber: Yup.string().required('phone is required'),
            email: Yup.string().required('email is required'),
        }),
        onSubmit: (values) => {
            edit(values)
        }
    })

    useEffect(() => {
        if (isError == false && data != undefined)
            formik.setValues(data)
    }, [isFetching])

    useEffect(() => {
        if (result.isSuccess)
            navigator(loc.state?.from ?? '/doctor/' + id)
    }, [result])

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit}
                  className={'d-flex flex-column p-5 mx-auto border border-3 rounded rounded-3 shadow gap-2 my-5 col-lg-8'}
                  style={{height: 'fit-content'}}>
                {isError && <p className={'text-center h5 text-danger'}>{useGetAppError(error)?.message}</p>}
                {result.isError &&
                    <p className={'text-center h5 text-danger'}>{useGetAppError(result.error)?.message}</p>}
                {result.isSuccess && <p className={'text-center h5 text-primary'}>Edit Complete Successfully</p>}
                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.firstname && formik.errors.firstname) ?
                            <label htmlFor="fname"
                                   className={'col-form-label text-danger'}>{formik.errors.firstname}</label> :
                            <label htmlFor="fname" className={'col-form-label'} style={styletext}>First Name</label>}
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.firstname && formik.errors.firstname) && 'border-1 border-danger'}`}
                            id={'fname'}
                            name={'firstname'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstname}
                            style={styleInput}
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.lastname && formik.errors.lastname) ?
                            <label htmlFor="lname"
                                   className={'col-form-label text-danger'}>{formik.errors.lastname}</label> :
                            <label htmlFor="lname" className={'col-form-label'} style={styletext}>Last Name</label>}
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.lastname && formik.errors.lastname) && 'border-1' +
                            ' border-danger'}`}
                            id={'lname'}
                            name={'lastname'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastname}
                            style={styleInput}
                        />
                    </div>
                </div>

                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.phoneNumber && formik.errors.phoneNumber) ?
                            <label htmlFor="phone"
                                   className={'col-form-label text-danger'}>{formik.errors.phoneNumber}</label> :
                            <label htmlFor="phone" className={'col-form-label'} style={styletext}>Phone</label>}
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
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.email && formik.errors.email) ?
                            <label htmlFor="email"
                                   className={'col-form-label text-danger'}>{formik.errors.email}</label> :
                            <label htmlFor="email" className={'col-form-label'} style={styletext}>Email</label>}
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
                        />
                    </div>
                </div>


                <button className={'btn w-50 align-self-center mt-3'} style={stylebtn}>Edit</button>
            </form>
        </div>
    );
};

export default EditDoctor;