import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import React, {useEffect} from "react";
import useGetAppError from "../../Hookes/useGetAppError";
import {useEditSubjectMutation, useGetSubjectByCodeQuery} from "../../App/Api/SubjectApi";
import {EditSubjectModel} from "../../Models/Subject/EditSubjectModel";

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
const EditSubject = () => {
    const {code} = useParams()
    const navigator = useNavigate()
    const loc = useLocation()
    const {data, isError, error, isFetching} = useGetSubjectByCodeQuery(+code!)
    const [edit, result] = useEditSubjectMutation()

    const formik = useFormik<EditSubjectModel>({
        initialValues: {
            id: 0,
            code: 0,
            name: '',
            hours: 0,
            department: ''
        },
        validationSchema: Yup.object({}),
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
            navigator(loc.state?.from ?? '/subject/' + formik.values.code)
    }, [result])

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit}
                  className={'d-flex flex-column p-5 mx-auto border border-3 rounded rounded-3 shadow gap-2 my-5 col-lg-8 '}
                  style={{height: 'fit-content'}}>
                {isError && <p className={'text-center h5 text-danger'}>{useGetAppError(error)?.message}</p>}
                {result.isError &&
                    <p className={'text-center h5 text-danger'}>{useGetAppError(result.error)?.message}</p>}
                {result.isSuccess && <p className={'text-center h5 text-primary'}>Edit Complete Successfully</p>}
                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.name && formik.errors.name) ?
                            <label htmlFor="name"
                                   className={'col-form-label text-danger'}>{formik.errors.name}</label> :
                            <label htmlFor="name" className={'col-form-label'} style={styletext}>Name</label>}
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.name && formik.errors.name) && 'border-1 border-danger'}`}
                            id={'name'}
                            name={'name'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            style={styleInput}
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.department && formik.errors.department) ?
                            <label htmlFor="department"
                                   className={'col-form-label text-danger'}>{formik.errors.department}</label> :
                            <label htmlFor="department" className={'col-form-label'}
                                   style={styletext}>Department</label>}
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.department && formik.errors.department) && 'border-1' +
                            ' border-danger'}`}
                            id={'department'}
                            name={'department'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.department}
                            style={styleInput}
                        />
                    </div>
                </div>

                <div className={'row d-flex justify-content-between align-items-end'}>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.code && formik.errors.code) ?
                            <label htmlFor="code"
                                   className={'col-form-label text-danger'}>{formik.errors.code}</label> :
                            <label htmlFor="code" className={'col-form-label'} style={styletext}>Code</label>}
                        <input
                            type="text"
                            className={`form-control ${(formik.touched.code && formik.errors.code) && 'border-1' +
                            ' border-danger'}`}
                            id={'code'}
                            name={'code'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.code}
                            style={styleInput}
                        />
                    </div>
                    <div className={'col-12 col-sm-6'}>
                        {(formik.touched.hours && formik.errors.hours) ?
                            <label htmlFor="hours"
                                   className={'col-form-label text-danger'}>{formik.errors.hours}</label> :
                            <label htmlFor="hours" className={'col-form-label'} style={styletext}>Hours</label>}
                        <input
                            type="number"
                            className={`form-control ${(formik.touched.hours && formik.errors.hours) && 'border-1' +
                            ' border-danger'}`}
                            id={'hours'}
                            name={'hours'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.hours}
                            style={styleInput}
                        />
                    </div>
                </div>


                <button className={'btn w-50 align-self-center mt-3'} style={stylebtn}>Edit</button>
            </form>
        </div>
    );
};

export default EditSubject;