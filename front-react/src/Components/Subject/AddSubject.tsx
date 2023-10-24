import React from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import useGetAppError from "../../Hookes/useGetAppError";
import {AddSubjectModel} from "../../Models/Subject/AddSubjectModel";
import {useAddSubjectMutation} from "../../App/Api/SubjectApi";

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
const AddSubject = () => {
    const [add, addResult] = useAddSubjectMutation()
    const formik = useFormik<AddSubjectModel>({
        initialValues: {
            name: '',
            code: 0,
            department: '',
            hours: 0
        },
        validationSchema: Yup.object({
            name: Yup.string().required('This Field Is Required'),
            code: Yup.number().required('This Field Is Required'),
            department: Yup.string().required('This Field Is Required'),
            hours: Yup.number().required('This Field Is Required')
        }),
        onSubmit: (values) => {
            add(values)
        }
    })

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit}
                  className={'d-flex flex-column p-5 mx-auto border border-3 rounded rounded-3 col-lg-8' +
                      ' shadow' +
                      ' gap-2 my-4'}
                  style={{height: 'fit-content'}}>
                <p className={'text-center h5 text-danger'}>{addResult.isError && useGetAppError(addResult.error)?.message}</p>
                <p className={'text-center h5 text-primary'}>{addResult.isSuccess && 'Subject Added Successfully'}</p>
                <h3 style={{fontFamily: "Roboto", color: "#000082", textAlign: "center", marginBottom: "20px"}}>Add new
                    Course</h3>

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
                            type="text"
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

                <button className={'btn  w-50 align-self-center mt-3'} style={stylebtn}>Add</button>
            </form>
        </div>);
};

export default AddSubject;