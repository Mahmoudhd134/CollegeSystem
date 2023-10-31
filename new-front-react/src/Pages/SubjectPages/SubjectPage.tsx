import {useParams} from "react-router-dom";
import {useDeleteAssignedDoctorMutation, useGetSubjectByCodeQuery} from "../../App/Api/SubjectApi";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import AppLink from "../../Components/Navigation/AppLink";
import useIsInRole from "../../Hookes/useIsInRole";
import {useState} from "react";
import {ChoseDoctor} from "./ChoseDoctor";

export const SubjectPage = () => {
    const {code} = useParams()
    const {data: subject, isFetching, isError, error} = useGetSubjectByCodeQuery(+(code ?? ''))
    const [displayChoseDoctor, setDisplayChoseDoctor] = useState(false);
    const [deAssign, deAssignResult] = useDeleteAssignedDoctorMutation()

    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')

    let subjectUi
    if (isFetching)
        subjectUi = <h3>Loading...</h3>

    if (isError && !isFetching)
        subjectUi = <h3>error <pre>{JSON.stringify(error, null, 4)}</pre></h3>


    subjectUi = (subject && !isFetching && !isError) ? <>
            <div
                className={(displayChoseDoctor ? 'absolute' : 'hidden') + " top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-500 w-11/12 h-5/6 bg-opacity-90 rounded-xl overflow-y-scroll"}
                style={{zIndex: 123}}
                onClick={e => e.stopPropagation()}
            >
                <ChoseDoctor subjectId={subject.id} closeModal={() => setDisplayChoseDoctor(false)}/>
            </div>
            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">{subject.name.split(' ').map(x => x[0].toUpperCase() + x.slice(1).toLowerCase())}</h3>
            <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div>Department: {subject.department.toUpperCase()}</div>
                <div>Code: {subject.code}</div>
                <div>Hours: {subject.hours}</div>
            </div>

            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Doctor</h3>
            <div className={'bg-blue-400 p-4 text-lg sm:text-md w-11/12 mx-auto'}>
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
                    </div> : <>
                        Has No Doctor
                        {isAdmin && <span className={'text-blue-800 hover:cursor-pointer'}
                                          onClick={e => {
                                              e.stopPropagation()
                                              setDisplayChoseDoctor(true)
                                          }}>
                        {' '}<b>Add One</b>
                    </span>}
                    </>}
            </div>
        </>
        : subjectUi

    return <div
        className={'my-container min-h-remaining relative'}
        onClick={_ => setDisplayChoseDoctor(false)}>
        <div className={'flex flex-col gap-3'}>
            {subjectUi}
            <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Rooms</h3>
            <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
                <div>Room one</div>
                <div>Room one</div>
                <div>Room one</div>
            </div>
        </div>
    </div>

};