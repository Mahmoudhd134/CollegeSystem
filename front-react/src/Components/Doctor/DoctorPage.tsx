import {useLocation, useNavigate, useParams} from "react-router-dom"
import {useGetDoctorQuery} from "../../App/Api/DoctorApi"
import {Alert} from 'react-bootstrap'
import useGetAppError from "../../Hookes/useGetAppError"
import './DoctorPage.css'
import DoctorField from "./DoctorField";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import useAppSelector from "../../Hookes/useAppSelector";
import {BASE_URL} from "../../App/Api/BaseApi";
import React, {useRef} from "react";
import useAppDispatch from "../../Hookes/useAppDispatch";
import UseAxiosApi from "../../Hookes/useAxiosApi";
import {useChangeProfilePhoto} from "../../App/Api/UserApi";

const DoctorPage = () => {
    const {id} = useParams()
    const {data, isError, error, isFetching} = useGetDoctorQuery(id ?? '')
    const loc = useLocation()
    const isAdmin = useAppSelector(s => s.auth.roles)?.some(r => r.toLowerCase() == 'admin')
    const navigator = useNavigate()
    const docImgPath = `${BASE_URL.slice(0, BASE_URL.length - 5)}/ProfileImages/${data?.profilePhoto}`
    const newImg = useRef() as React.MutableRefObject<HTMLInputElement>
    const dispatch = useAppDispatch()
    const api = UseAxiosApi()
    const changeProfilePhotoApi = useChangeProfilePhoto(api, dispatch)

    const changeProfilePhotoHandler = async (e: React.ChangeEvent) => {
        const formData = new FormData()
        const f = newImg.current.files?.item(0)!
        formData.append('file', f)
        console.log(f)
        await changeProfilePhotoApi(formData, data?.id ?? 'ME')
    }

    if (isFetching) {
        const s: JSX.Element[] = []
        for (let i = 0; i < 4; i++) {
            s.push(
                <div key={i}
                     className={`col-11 col-sm-8 col-md-5 col-lg-3 d-flex flex-column align-items-center
                     border border-3 rounded-3 p-3 text-center`}>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'mt-1 field__looding'}></h3>
                    <p className={'field__looding'}></p>
                </div>
            )
        }
        return <div className="container">
            <div className="d-flex flex-column">
                <button className={'w-50 btn btn-outline-dark border-0 field__looding mx-auto my-3'}></button>
                <div className={'subject__looding'}>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'field__looding'}></h3>
                    <h3 className={'field__looding'}></h3>
                </div>
                <div className="row justify-content-center justify-content-sm-around gap-3">
                    {s}
                </div>
            </div>
        </div>
    }

    const per = (data?.subjects
        .map(s => s.numberOfFilesTypes)
        .filter(n => n == (Object.keys(SubjectFileTypes).length / 2))
        .length ?? 1) / (data?.subjects.length ?? 1) * 100

    return (
        <div className="container">
            {isError && <Alert variant="danger" className={'text-center'}>{useGetAppError(error)?.message}</Alert>}
            {data?.isOwner && <div className="d-flex flex-column align-items-center my-2">
                <div className="btn text-primary w-50"
                     onClick={e => navigator('/doctor/edit/' + data.id, {state: {from: loc}})}
                > Edit
                </div>
                <div className="btn text-primary w-50"
                     onClick={e => navigator('/auth/changePassword', {state: {from: loc}})}
                > Change Password
                </div>
            </div>}


            <div className="doctor bg-white shadow rounded-lg d-block d-sm-flex flex-sm-wrap justify-content-center">
                <div className="profile-tab-nav border-right">
                    <div>
                        {data?.isOwner ? <div className={'d-flex justify-content-center'}>
                                <div className="img-circle text-center mb-3" style={{
                                    width: 'fit-content'
                                }}>
                                    <img src={docImgPath} alt="Image" className="shadow"
                                         style={{cursor: 'pointer'}}
                                         onClick={e => newImg.current.click()}/>
                                    <input type="file" onChange={changeProfilePhotoHandler} ref={newImg}
                                           className={'d-none'}/>
                                </div>
                            </div> :
                            <div className="img-circle text-center mb-3 ">
                                <img src={docImgPath} alt="Image" className="shadow"></img>
                            </div>}
                        <h3 className="text-center text-wrap" id={'doctor-name'}>
                            {data?.firstname! + " " + data?.lastname!}
                        </h3>
                        {isAdmin && <div className="row justify-content-center my-1 mt-5">
                            <div className=" col-lg-3">
                                <button className={'btn-alarm w-100'}
                                        onClick={e => navigator(`/message/send/${data?.id}/${data?.username}`)}
                                ><img src="/images/alarm.png" style={{
                                    width: '30px',
                                    backgroundColor: "#fff",
                                    height: "30px",
                                    marginRight: "10px"
                                }}></img>Send Alarm
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>

                <div className="info w-100">
                    <div><DoctorField title={'First Name:'} data={data?.firstname!}/></div>
                    <div><DoctorField title={'Last Name:'} data={data?.lastname!}/></div>
                    <div><DoctorField title={'User Name:'} data={data?.username!}/></div>
                    <div><DoctorField title={'Email:'} data={data?.email!}/></div>
                    <div><DoctorField title={'Phone Number:'} data={data?.phoneNumber!}/></div>
                    <div><DoctorField title={'National Number:'} data={data?.nationalNumber!}/></div>

                    <div>
                        <div className="text-primary mb-3 d-flex">
                            <span>Has Done</span>
                            <span className={'ms-auto'}>{data?.subjects
                                .map(s => s.numberOfFilesTypes)
                                .filter(n => n == (Object.keys(SubjectFileTypes).length / 2))
                                .length ?? -1}/{data?.subjects.length ?? -1}</span>
                        </div>
                        <div className="progress col-lg-10" style={{height: "24px"}}>
                            <div className="progress-bar" style={{width: `${per}%`}}>{per}%</div>
                        </div>
                    </div>

                    {isAdmin && <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 btn btn-primary text-white my-3"
                             onClick={e => navigator(`/doctor/report/${data?.id}`, {state: {from: loc}})}
                        >
                            Generate Report
                        </div>
                    </div>}
                </div>

                <div className="row justify-content-center justify-content-sm-around gap-3">
                    {data?.subjects?.length ?? 0 > 0 ? data?.subjects.map(s =>
                        <div key={s.id}
                             className={'col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3 d-flex flex-column align-items-center border text-center border-3 rounded-3 subject'}
                             onClick={e => navigator('/subject/' + s.code, {state: {from: loc}})}>
                            <h3 className={'text-wrap'}>{s.name}</h3>
                            <h3 className={'mt-1'}>{s.department}</h3>
                            <p>{s.code}</p>
                            <h5 className={'mt-auto'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'end',
                                    color: s.numberOfFilesTypes == (Object.keys(SubjectFileTypes).length / 2) ? 'blue' : 'red'
                                }}
                            ><b>{s.numberOfFilesTypes}</b>&nbsp;File Type Uploaded</h5>
                        </div>
                    ) : (
                        <>
                            <h3 className='text-center mt-5 text-danger'>No Subjects Assigned!!</h3>
                            <p className='text-center text-danger'>
                                if you think that is wrong please contact the admin</p>
                        </>
                    )}
                </div>
            </div>

        </div>


    )

}

export default DoctorPage