import React, {useEffect, useRef, useState} from 'react';
import {useDeleteAssignedDoctorMutation, useGetSubjectByCodeQuery} from "../../App/Api/SubjectApi";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useGetAppError from "../../Hookes/useGetAppError";
import './SubjectPage.css'
import useAppSelector from "../../Hookes/useAppSelector";
import {useAssignDoctorToSubjectMutation, useLazyGetDoctorPageQuery} from "../../App/Api/DoctorApi";
import SubjectMaterials from "./SubjectMaterials";
import Forbidden403 from "../Global/Forbidden/Forbidden403";
import ProgressLine from "./ProgressBar/ProgressLine";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import {BASE_URL} from "../../App/Api/BaseApi";

const SubjectPage = () => {
    const {code} = useParams()
    const p = useRef() as React.MutableRefObject<HTMLDivElement>
    const navigator = useNavigate()
    const {data: subject, isError, error, isFetching} = useGetSubjectByCodeQuery(Number(code))
    const isAdmin = useAppSelector(s => s.auth.roles)?.some(r => r.toLowerCase() == 'admin')
    const [deleteDoctor, deleteDoctorResult] = useDeleteAssignedDoctorMutation()
    const [assignDoctor, assignDoctorResult] = useAssignDoctorToSubjectMutation()
    const [doctorUsername, setDoctorUsername] = useState('')
    const [send, doctorListResult] = useLazyGetDoctorPageQuery()
    const loc = useLocation()
    

    useEffect(() => {
        if (p.current == undefined)
            return

        if (isFetching) {
            p.current.style.opacity = '.5'
            p.current.onmousemove = e => e.preventDefault()
        } else {
            p.current.style.opacity = '1'
            p.current.onmousemove = null
        }
    }, [isFetching])

    useEffect(() => {
        if (!doctorUsername)
            return
        send({
            pageIndex: 0,
            pageSize: 5,
            usernamePrefix: doctorUsername
        })
    }, [doctorUsername])


    useEffect(() => {

    }, [doctorUsername])

    const deleteDoctorHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteDoctor(subject?.id!)
    }

    const assignDoctorHandler = (did: string) => {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            setDoctorUsername('')
            assignDoctor({did, sid: subject?.id!})
        }
    }


    if (isError || subject == undefined) {
        const msg = useGetAppError(error)?.message ?? "You Can Not Get Here"
        const code = useGetAppError(error)?.code ?? "NO-CODE"

        if (code == 'Subject.WrongCode')
            return <Forbidden403 errors={[{title: 'WRONG CODE', text: msg}]}/>
        else if (code == 'Subject.UnAuthorizedGet')
            return <Forbidden403 errors={[{title: 'FORBIDDEN', text: msg}]}/>
        else if (isFetching == false)
            return <Forbidden403 errors={[{title: 'Error', text: msg + ' Try To Login Again!'}]}/>
        else
            return <h3>Loading</h3>
    }

    const numberOfFileTypes = subject.files
        .map(f => f.type.valueOf())
        .reduce((prev, curr) => prev.some(e => e == curr) ? prev : [...prev, curr], [] as number[])
        .length

    const line = <ProgressLine label="Files Uploaded"
                               text={`${numberOfFileTypes}/${Object.keys(SubjectFileTypes).length / 2}`}
                               visualParts={[{
                                   percentage: `${numberOfFileTypes / Object.keys(SubjectFileTypes).length * 200}%`,
                                   color: 'blue'
                               }]}
                               backgroundColor={'lightblue'}
    />

    return (
        <div className="container" ref={p}>
            {isAdmin && <div className={'row justify-content-center'}>
                <button className={'col-8 col-md-6 btn btn-outline-dark my-3'}
                        onClick={e => navigator('/subject/edit/' + subject?.code!)}>Edit
                </button>
            </div>}


            <div className="card">
                <div className="card-header">
                    <h2 className={'text-center'}>{subject.name}</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <p>
                                <strong>Code:</strong> {subject.code}
                            </p>
                        </div>
                        <div className="col-md-4">
                            <p>
                                <strong>Department:</strong> {subject.department}
                            </p>
                        </div>
                        <div className="col-md-4">
                            <p>
                                <strong>Hours:</strong> {subject.hours}
                            </p>
                        </div>
                    </div>

                    {subject.hasADoctor ? <div className="row">
                        <div className="col-md-6">
                            <p onClick={e => navigator(`/doctor/${subject.doctorId}`, {state: {from: loc}})}
                               style={{cursor: "pointer"}}
                            >
                                <img
                                    className='rounded-circle img-thumbnail'
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'contain'
                                    }}
                                    src={BASE_URL.slice(0, BASE_URL.length - 5) + '/profileImages/' + subject.doctorProfilePhoto}
                                    alt=""/>
                                {subject.doctorUsername}
                            </p>
                        </div>
                        {isAdmin && <div className={'col-md-6'}>
                            <button className={'btn btn-outline-danger'}
                                    onClick={deleteDoctorHandler}
                            >Remove Doctor
                            </button>
                        </div>}
                    </div> : (<div className={'text-center text-danger'}>
                        <h3>This Subject Is Not Assigned To Any Doctor Yet!</h3>
                        <p>if you think that is wrong, please contact the admin</p>
                        <h4 className="my-3 text-black">Assign</h4>
                        <div className={'row justify-content-center'}>
                            <div className={'col-md-6'}>
                                <input type="text"
                                       placeholder={'Doctor Username'}
                                       className={'form-control'}
                                       onChange={e => setDoctorUsername(e.currentTarget.value)}
                                />
                                {doctorUsername.trim().length > 0 && <div className="list-group">
                                    {doctorListResult?.data?.map(d => <button
                                        className={'list-group-item list-group-item-action'}
                                        key={d.id}
                                        onClick={assignDoctorHandler(d.id)}
                                    >
                                        <img
                                            className='rounded-circle img-thumbnail'
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'contain'
                                            }}
                                            src={BASE_URL.slice(0, BASE_URL.length - 5) + '/profileImages/' + d.profilePhoto}
                                            alt=""/>
                                        {d.username}
                                    </button>)}
                                </div>}
                            </div>
                        </div>
                    </div>)}

                    <div className="my-2">
                        {line}
                    </div>

                    {isAdmin && <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 btn btn-primary text-white my-3"
                             onClick={e => navigator(`/subject/report/${subject?.id}`, {state: {from: loc}})}
                        >
                            Generate Report
                        </div>
                    </div>}

                    <SubjectMaterials materials={subject?.files}
                                      isOwner={subject.isOwner}
                                      id={subject?.id!}
                                      code={subject?.code!}/>
                </div>
            </div>
        </div>
    );
};

export default SubjectPage;