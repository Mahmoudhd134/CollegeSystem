import {Link, useParams} from "react-router-dom";
import {useDeleteAssignedDoctorMutation, useGetSubjectByCodeQuery} from "../../App/Api/SubjectApi";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import AppLink from "../../Components/Navigation/AppLink";
import useIsInRole from "../../Hookes/useIsInRole";
import {useState} from "react";
import {ChoseDoctor} from "./ChoseDoctor";
import {MyButton} from "../../Components/Form/MyButton";

export const SubjectPage = () => {
    const {code} = useParams()
    const {data: subject, isFetching, isError, error} = useGetSubjectByCodeQuery(+(code ?? ''))
    const [displayChoseDoctor, setDisplayChoseDoctor] = useState(false);
    const [deAssign] = useDeleteAssignedDoctorMutation()

    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')

    let subjectUi
    let roomsUi
    if (isFetching) {
        subjectUi = <div className={'animate-pulse flex flex-col gap-3 relative'}>
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50"></div>
            <h3 className="bg-blue-300 text-center text-2xl sm:text-xl p-4">Subject</h3>
            <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div>Department: xxx</div>
                <div>Code: xxx</div>
                <div>Hours: x</div>
            </div>

            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Doctor</h3>
            <div className={'bg-blue-300 p-4 text-lg sm:text-md w-11/12 mx-auto flex justify-between items-center'}>
                <div
                    className={'flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between text-center'}>
                    <img src={PROFILE_IMAGES_URL + 'default.png'}
                         alt={'default_image'}
                         className={'w-12 h-12 object-contain rounded-full inline'}
                    />
                    <span className="h-3 w-16"></span>
                    {isAdmin && <div className="">
                        <button
                            className={'mx-auto sm:ml-auto sm:self-end text-red-800 h-12 w-24 p-4 hover:bg-red-500 transition-all rounded-xl flex justify-center items-center'}
                        >Remove
                        </button>
                    </div>}
                </div>
                {(isAdmin || isDoctor) && <Link to={`/Subject/${subject?.code}/Report`}
                                                className={''}>
                    <MyButton type={'button'}>Report</MyButton>
                </Link>}
            </div>
        </div>

        roomsUi = <div className={'animate-pulse flex flex-col gap-3 relative'}>
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50"></div>
            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Rooms</h3>
            <div className={'bg-blue-300 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div className="flex-sm1-md2-lg3-gap-3 justify-around">
                    {(isAdmin || isDoctor) && <>
                        <AppLink to={`/Subject/${code}/Students`}
                                 className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                            <img src="/Images/students.jpg" alt="students_picture"
                                 className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                            <b>Students</b>
                        </AppLink>

                        <AppLink to={`/Subject/${code}/Files`}
                                 className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                            <img src="/Images/files.jpg" alt="files_picture"
                                 className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                            <b>Files</b>
                        </AppLink></>}

                </div>
            </div>
        </div>
    }


    if (isError && !isFetching) {
        subjectUi = <h3>error <pre>{JSON.stringify(error, null, 4)}</pre></h3>
        roomsUi = <></>
    }


    subjectUi = (subject && !isFetching && !isError) ? <>
            <div
                className={(displayChoseDoctor ? 'absolute' : 'hidden') + " top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-500 w-11/12 h-5/6 bg-opacity-90 rounded-xl overflow-y-scroll"}
                style={{zIndex: 123}}
                onClick={e => e.stopPropagation()}
            >
                <ChoseDoctor subjectId={subject.id} closeModal={() => setDisplayChoseDoctor(false)}/>
            </div>

            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">
                {subject.name.split(' ').map(x => x[0].toUpperCase() + x.slice(1).toLowerCase() + ' ')}
            </h3>
            <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div>Department: {subject.department.toUpperCase()}</div>
                <div>Code: {subject.code}</div>
                <div>Hours: {subject.hours}</div>
            </div>

            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Doctor</h3>
            <div className={'bg-blue-400 p-4 text-lg sm:text-md w-11/12 mx-auto flex justify-between items-center'}>
                {subject.hasADoctor ?
                    <div
                        className={'flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between text-center'}>
                        <AppLink to={'/doctor/' + subject.doctorId}>
                            <img src={PROFILE_IMAGES_URL + subject.doctorProfilePhoto}
                                 alt={"profile_image_for_doctor_" + subject.doctorUsername}
                                 className={'w-12 h-12 object-contain rounded-full inline'}
                            />
                            @{subject.doctorUsername}
                        </AppLink>
                        {isAdmin && <div className="">
                            <button
                                className={'mx-auto sm:ml-auto sm:self-end text-red-800 h-12 w-24 p-4 hover:bg-red-500 transition-all rounded-xl flex justify-center items-center'}
                                onClick={_ => deAssign(subject.id)}
                            >Remove
                            </button>
                        </div>}
                    </div> : <div>
                        Has No Doctor
                        {isAdmin && <span className={'text-blue-800 hover:cursor-pointer'}
                                          onClick={e => {
                                              e.stopPropagation()
                                              setDisplayChoseDoctor(true)
                                          }}>
                        {' '}<b>Add One</b>
                    </span>}
                    </div>}
                {(isAdmin || isDoctor) && <Link to={`/Subject/${subject?.code}/Report`}
                                                className={''}>
                    <MyButton type={'button'}>Report</MyButton>
                </Link>}
            </div>
        </>
        : subjectUi

    roomsUi = (!isError && !isFetching && subject) ? <>
        <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Rooms</h3>
        <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
            <div className="flex-sm1-md2-lg3-gap-3 justify-around">
                {(isAdmin || isDoctor) && <>
                    <AppLink to={`/Subject/${subject?.code}/Students`}
                             className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                        <img src="/Images/students.jpg" alt="students_picture"
                             className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                        <b>Students</b>
                    </AppLink>

                    <AppLink to={`/Subject/${subject?.code}/Files`}
                             className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                        <img src="/Images/files.jpg" alt="files_picture"
                             className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                        <b>Files</b>
                    </AppLink></>}

            </div>
        </div>
    </> : roomsUi

    return <div
        className={'my-container min-h-remaining relative'}
        onClick={_ => setDisplayChoseDoctor(false)}>
        <div className={'flex flex-col gap-3'}>
            {subjectUi}
            {roomsUi}
        </div>
    </div>

};