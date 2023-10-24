import {useEffect, useState} from "react";
import {useAddDoctorMutation} from "../../App/Api/DoctorApi";
import {useFormik} from "formik";
import useGetAppError from "../../Hookes/useGetAppError";
import {BASE_URL} from "../../App/Api/axiosApi";
import {AddDoctorModel} from "../../Models/Doctor/AddDoctorModel";
import * as Yup from "yup";
import './doctor.css'

const AddDoctor = () => {

    const [add, addResult] = useAddDoctorMutation();
    const [validName, setValidName] = useState(true);
    //@ts-ignore
    const formik = useFormik<AddDoctorModel & { confirmPassword: string }>({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            nationalNumber: ""
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("first name is required"),
            lastName: Yup.string().required("last name is required"),
            username: Yup.string().required("username is required"),
            phoneNumber: Yup.string().required("phone is required"),
            email: Yup.string().required("email is required"),
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
                    test: (v) => formik.values.password == v
                })
                .required("confirm password is required")
        }),
        onSubmit: (values: AddDoctorModel) => {
            add(values);
        }
    });

    useEffect(() => window.scroll({top: 0, behavior: 'smooth'}), [addResult])

    useEffect(() => {
        if (!validName) {
            console.log("setting errors");
            formik.setErrors({...formik.errors, username: formik.errors.username + "\nthe username is already token"});
        }
    }, [validName]);

    useEffect(() => {
        if (formik.values.username.trim().length == 0)
            return;

        fetch(`${BASE_URL}auth/isvalidusername/` + formik.values.username)
            .then(r => r.json())
            .then(r => setValidName(r));
    }, [formik.values.username]);

    return (
        <div className="container mx-auto p-4 min-h-remaining">
            <form onSubmit={formik.handleSubmit}
                  className={"w-full sm:w-3/4 lg:w-2/3 mx-auto sm:border-2 sm:border-blue-300 sm:rounded-lg p-4"}>
                {addResult.isError &&
                    <p className={"text-center text-red-500 text-2xl bg-blue-200 p-2"}>{useGetAppError(addResult.error)?.message}</p>}
                {addResult.isSuccess &&
                    <p className={"text-center text-blue-600 text-2xl bg-blue-200 p-2"}>Registration Complete
                        Successfully</p>}
                <h3 className={"text-blue-900 text-center text-3xl sm:text-2xl my-3"}>Add new Doctor</h3>

                <div className={"grid gird-cols-1 sm:grid-cols-2 justify-center items-end w-full gap-5 gap-y-3"}>
                    <div>
                        {(formik.touched.firstName && formik.errors.firstName) ?
                            <label htmlFor={"firstName"} className="text-red-500">
                                {formik.errors.firstName}</label> :
                            <label htmlFor="firstName" className={"text-blue-500"}>First Name</label>}
                        <input
                            className="add-doctor-input"
                            type="text"
                            id={"firstName"}
                            name={"firstName"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                            placeholder="First Name"
                        />
                    </div>

                    <div>
                        {(formik.touched.lastName && formik.errors.lastName) ?
                            <label htmlFor={"lastName"} className="text-red-500">
                                {formik.errors.lastName}</label> :
                            <label htmlFor="lastName" className={"text-blue-500"}>Last Name</label>}
                        <input
                            className="add-doctor-input"
                            type="text"
                            id={"lastName"}
                            name={"lastName"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                            placeholder="Last Name"
                        />
                    </div>

                    <div>
                        {(formik.touched.username && formik.errors.username) ?
                            <label htmlFor={"username"} className="text-red-500">
                                {formik.errors.username}</label> :
                            <label htmlFor="uname" className={"text-blue-500"}>Username</label>}
                        <input
                            className="add-doctor-input"
                            type="text"
                            id={"username"}
                            name={"username"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            placeholder="Username"
                        />
                    </div>

                    <div>
                        {(formik.touched.phoneNumber && formik.errors.phoneNumber) ?
                            <label htmlFor={"phoneNumber"} className="text-red-500">
                                {formik.errors.phoneNumber}</label> :
                            <label htmlFor="phoneNumber" className={"text-blue-500"}>Phone Number</label>}
                        <input
                            className="add-doctor-input"
                            type="text"
                            id={"phoneNumber"}
                            name={"phoneNumber"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                            placeholder="Phone Number"
                        />
                    </div>

                    <div>
                        {(formik.touched.nationalNumber && formik.errors.nationalNumber) ?
                            <label htmlFor={"nationalNumber"} className="text-red-500">
                                {formik.errors.nationalNumber}</label> :
                            <label htmlFor="nationalNumber" className={"text-blue-500"}>National Number</label>}
                        <input
                            className="add-doctor-input"
                            type="text"
                            id={"nationalNumber"}
                            name={"nationalNumber"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nationalNumber}
                            placeholder="National Number"
                        />
                    </div>

                    <div>
                        {(formik.touched.email && formik.errors.email) ?
                            <label htmlFor={"email"} className="text-red-500">
                                {formik.errors.email}</label> :
                            <label htmlFor="email" className={"text-blue-500"}>Email</label>}
                        <input
                            className="add-doctor-input"
                            type="email"
                            id={"email"}
                            name={"email"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        {(formik.touched.password && formik.errors.password) ?
                            <label htmlFor={"password"} className="text-red-500">
                                {formik.errors.password}</label> :
                            <label htmlFor="password" className={"text-blue-500"}>Password</label>}
                        <input
                            className="add-doctor-input"
                            type="password"
                            id={"password"}
                            name={"password"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder="Password"
                        />
                    </div>

                    <div>
                        {(formik.touched.confirmPassword && formik.errors.confirmPassword) ?
                            <label htmlFor={"confirmPassword"} className="text-red-500">
                                {formik.errors.confirmPassword}</label> :
                            <label htmlFor="confirmPassword" className={"text-blue-500"}>Confirm Password</label>}
                        <input
                            className="add-doctor-input"
                            type="password"
                            id={"con-confirmPassword"}
                            name={"confirmPassword"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            placeholder="Confirm Password"
                        />
                    </div>

                </div>

                <div className="flex justify-center mt-3">
                    <button
                        className={"add-doctor-add-button"}>Add
                    </button>
                </div>
            </form>
        </div>
    );
};
export default AddDoctor;