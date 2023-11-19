import {useParams} from "react-router-dom";
import {
    useDeleteAssignedDoctorMutation,
    useDeleteSubjectMutation,
    useGetSubjectByCodeQuery
} from "../../App/Api/SubjectApi";
import {PROFILE_IMAGES_URL, ROOM_IMAGES_URL} from "../../App/Api/axiosApi";
import AppLink from "../../Components/Navigation/AppLink";
import useIsInRole from "../../Hookes/useIsInRole";
import {lazy, Suspense, useEffect, useState} from "react";
import {MyButton} from "../../Components/Form/MyButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
const ProfileContainer  = lazy(() => import("../../Components/Profile/ProfileContainer"));
const ProfileTitle  = lazy(() => import("../../Components/Profile/ProfileTitle"));
const ProfileSection  = lazy(() => import("../../Components/Profile/ProfileSection"));
const MyButtonAsLink  = lazy(() => import("../../Components/Form/MyButtonAsLink"));
import {
    useAssignSubjectWithStudentMutation,
    useDeAssignSubjectFromStudentMutation,
    useLazyIsAssignedToSubjectQuery
} from "../../App/Api/StudentApi";
import useAppSelector from "../../Hookes/useAppSelector";

const ChoseDoctor = lazy(() => import('./ChoseDoctor'))
const SubjectPage = () => {
    const {code} = useParams()
    const {data: subject, isFetching, isError, error} = useGetSubjectByCodeQuery(+(code ?? ''))
    const [displayChoseDoctor, setDisplayChoseDoctor] = useState(false);
    const [deAssign] = useDeleteAssignedDoctorMutation()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [remove, removeResult] = useDeleteSubjectMutation()
    const navigator = useAppNavigator()
    const [isAssign, isAssignResult] = useLazyIsAssignedToSubjectQuery()
    const [assignToSubject, {isLoading: assignLoading}] = useAssignSubjectWithStudentMutation()
    const [deAssignFromSubject, {isLoading: deAssignLoading}] = useDeAssignSubjectFromStudentMutation()
    const isMutating = isFetching || removeResult.isLoading || assignLoading || deAssignLoading
    const myId = useAppSelector(s => s.auth.id)

    const {messageNotifications, delayedSubjectMessage} = useAppSelector(s => s.app)
    const roomHasUnReadMessages: { name: string, count: number }[] = [
        ...messageNotifications.map(n => ({
            name: n.roomName,
            count: 1
        })).reduce((previousValue, currentValue) => {
            const index = previousValue.findIndex(x => x.name === currentValue.name)
            if (index == -1) {
                previousValue.push({name: currentValue.name, count: 1})
                return previousValue
            }
            previousValue[index].count += 1
            return previousValue
        }, [] as { name: string, count: number }[]),
        ...delayedSubjectMessage.flatMap(d => d.delayedRooms.map(r => ({name: r.roomName, count: r.messageCount})))
    ]

    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')
    const isStudent = isInRole('student')

    useEffect(() => {
        if (isStudent && subject)
            isAssign(subject.id)
    }, [isStudent, subject?.id])

    useEffect(() => {
        if (removeResult.isSuccess)
            navigator('/Subject')
    }, [removeResult.isSuccess])

    const assignToThisSubject = () => assignToSubject(subject?.id!)
    const deAssignFromThisSubject = () => deAssignFromSubject(subject?.id!)

    let subjectUi
    let roomsUi
    if (isMutating) {
        subjectUi = <div className={'animate-pulse flex flex-col gap-3 relative'}>
            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4 flex justify-center gap-7">
                <div>{subject?.name.split(' ').map(x => x[0].toUpperCase() + x.slice(1).toLowerCase() + ' ')}</div>
                {isAdmin && <>
                    <div><AppLink to={'/Subject/Edit/' + subject?.code}><FontAwesomeIcon icon={faPencil}/></AppLink>
                    </div>
                    <div className={'hover:cursor-pointer'}
                         onClick={_ => {
                             setConfirmDelete(true)
                             window.scroll({
                                 top: 0,
                                 behavior: 'smooth'
                             })
                         }}
                    ><FontAwesomeIcon color='red' icon={faTrash}/></div>
                </>}
            </h3>
            <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div>Department: {subject?.department.toUpperCase()}</div>
                <div>Code: {subject?.code}</div>
                <div>Hours: {subject?.hours}</div>
                {(isAdmin || isDoctor) && <div>
                    <MyButtonAsLink to={`/Subject/${subject?.code}/Report`}>
                        Report
                    </MyButtonAsLink>
                </div>}
            </div>
            <ProfileTitle>Actions</ProfileTitle>
            <ProfileSection>
                <div className="h-16"></div>
            </ProfileSection>

            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Doctor</h3>
            <div className={'bg-blue-400 p-4 text-lg sm:text-md w-11/12 mx-auto flex justify-between items-center'}>
                {subject?.hasADoctor ?
                    <div
                        className={'flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between text-center'}>
                        <AppLink to={'/doctor/' + subject?.doctorId}>
                            <img src={PROFILE_IMAGES_URL + subject?.doctorProfilePhoto}
                                 alt={"profile_image_for_doctor_" + subject?.doctorUsername}
                                 className={'w-12 h-12 object-contain rounded-full inline'}
                            />
                            @{subject?.doctorUsername}
                        </AppLink>
                        {isAdmin && <div className="">
                            <button
                                className={'mx-auto sm:ml-auto sm:self-end text-red-800 h-12 w-24 p-4 hover:bg-red-500 transition-all rounded-xl flex justify-center items-center'}
                                onClick={_ => deAssign(subject?.id)}
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


    subjectUi = (subject && !isMutating) ? <>
            {displayChoseDoctor && <div
                className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-11/12 h-5/6 bg-opacity-90 rounded-xl overflow-y-scroll"}
                style={{zIndex: 123}}
                onClick={e => e.stopPropagation()}
            >
                <Suspense fallback={<h3>Getting The Form...</h3>}>
                    <ChoseDoctor subjectId={subject.id} closeModal={() => setDisplayChoseDoctor(false)}/>
                </Suspense>
            </div>}

            {confirmDelete && <div className={'border-2 rounded-xl p-3 text-center'}>
                <div>
                    Are You Sure You Want To Delete '{subject.name}' ?
                </div>
                <div className="flex flex-wrap gap-3 justify-around my-3">
                    <MyButton type={'button'}
                              onClick={_ => {
                                  remove(subject.id)
                                  setConfirmDelete(false)
                              }}>Delete</MyButton>

                    <MyButton type={'button'}
                              onClick={_ => setConfirmDelete(false)}>Return Back</MyButton>
                </div>
            </div>}

            <ProfileTitle>
                <div>{subject.name.split(' ').map(x => x[0].toUpperCase() + x.slice(1).toLowerCase() + ' ')}</div>
            </ProfileTitle>
            <ProfileSection>
                <div>Department: {subject.department.toUpperCase()}</div>
                <div>Code: {subject.code}</div>
                <div>Hours: {subject.hours}</div>
            </ProfileSection>

            <ProfileTitle>Doctor</ProfileTitle>
            <ProfileSection>
                {subject.hasADoctor ?
                    <div
                        className={'flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between text-center'}>
                        {(isAdmin || isDoctor) ? <AppLink to={'/doctor/' + subject.doctorId}>
                            <img src={PROFILE_IMAGES_URL + subject.doctorProfilePhoto}
                                 alt={"profile_image_for_doctor_" + subject.doctorUsername}
                                 className={'w-12 h-12 object-contain rounded-full inline'}
                            />
                            @{subject.doctorUsername}
                        </AppLink> : <div>
                            <img src={PROFILE_IMAGES_URL + subject.doctorProfilePhoto}
                                 alt={"profile_image_for_doctor_" + subject.doctorUsername}
                                 className={'w-12 h-12 object-contain rounded-full inline'}
                            />
                            @{subject.doctorUsername}
                        </div>}
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
            </ProfileSection>

            <ProfileTitle>Actions</ProfileTitle>
            <ProfileSection>
                <div className="flex justify-around flex-wrap items-center">
                    {(subject.doctorId == myId) && <div>
                        <MyButtonAsLink to={'AddRoom/' + subject.id}>
                            Add Room
                        </MyButtonAsLink>
                    </div>}
                    {isAdmin && <>
                        <div>
                            <MyButtonAsLink to={'/Subject/Edit/' + subject.code}><FontAwesomeIcon
                                icon={faPencil}/></MyButtonAsLink>
                        </div>
                        <div className={'hover:cursor-pointer'}
                             onClick={_ => {
                                 setConfirmDelete(true)
                                 window.scroll({
                                     top: 0,
                                     behavior: 'smooth'
                                 })
                             }}>
                            <MyButton type={'button'}><FontAwesomeIcon color='red' icon={faTrash}/></MyButton>
                        </div>
                    </>}
                    {(isAdmin || (subject.doctorId == myId)) && <div>
                        <MyButtonAsLink to={`/Subject/${subject.code}/Report`}>
                            Report
                        </MyButtonAsLink>
                    </div>}
                    {isStudent && (
                        isAssignResult.data ?
                            <MyButton type={'button'}
                                      className={'bg-red-100 hover:bg-red-200 focus:bg-red-300'}
                                      onClick={deAssignFromThisSubject}>
                                DeAssign
                            </MyButton> :
                            <MyButton type={'button'}
                                      onClick={assignToThisSubject}>
                                Assign
                            </MyButton>
                    )}
                </div>
            </ProfileSection>
        </>
        : subjectUi

    roomsUi = (subject && !isMutating) ? <>
        <ProfileTitle>Rooms</ProfileTitle>
        <ProfileSection>
            <div className="flex-sm1-md2-lg3-gap-3 justify-around">
                {(isAdmin || isDoctor) && <>
                    <AppLink to={`Students`}
                             className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                        <img src="/Images/students.jpg" alt="students_picture"
                             className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                        <b>Students</b>
                    </AppLink>

                    <AppLink to={`Files`}
                             className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex justify-center items-center text-2xl sm:text-xl group">
                        <img src="/Images/files.jpg" alt="files_picture"
                             className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                        <b>Files</b>
                    </AppLink></>}

                {subject.rooms.map(r => {
                    const index = roomHasUnReadMessages.findIndex(rr => rr.name.toLowerCase() === r.name)
                    console.log(roomHasUnReadMessages)
                    if (r.name == 'room two')
                        console.log(index)
                    return <AppLink to={'/Room/' + r.id}
                                    key={r.id}
                                    className="h-48 border rounded-xl hover:shadow-xl transition-all hover:cursor-pointer bg-blue-100 relative flex flex-col justify-center items-center text-2xl sm:text-xl group">
                        <img src={ROOM_IMAGES_URL + r.image} alt="room_picture"
                             className={'absolute top-0 left-0 rounded-xl opacity-50 w-full h-full object-fit group-hover:opacity-0 transition-all'}/>
                        <b>{r.name}</b>
                        {index !== -1 && <p>Has {roomHasUnReadMessages[index].count} un read messages!</p>}
                    </AppLink>
                })}
            </div>
        </ProfileSection>
    </> : roomsUi

    return <div onClick={_ => setDisplayChoseDoctor(false)}>
        <div className={'my-container min-h-remaining relative'}>
            <ProfileContainer>
                {subjectUi}
                {roomsUi}
            </ProfileContainer>
        </div>
    </div>
};

export default SubjectPage