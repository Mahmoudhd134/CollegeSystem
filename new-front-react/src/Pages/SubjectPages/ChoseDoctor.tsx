import {useAssignDoctorToSubjectMutation, useLazyGetDoctorPageQuery} from "../../App/Api/DoctorApi";
import {useEffect, useState} from "react";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import getAppError from "../../Utilites/getAppError";

export const ChoseDoctor = ({subjectId, closeModal}: { subjectId: number, closeModal: () => void }) => {
    const [assign, assignResult] = useAssignDoctorToSubjectMutation()
    const [getDoctors, {data: doctors}] = useLazyGetDoctorPageQuery()
    const [doctorUsername, setDoctorUsername] = useState<string>();

    useEffect(() => {
        getDoctors({
            pageIndex: 0,
            pageSize: 5,
            usernamePrefix: doctorUsername ?? ''
        })
    }, [doctorUsername]);

    return (
        <div className={'p-4'}>
            <h3 className="text-center text-lg sm:text-md">
                Chose Doctor For Subject From Here
            </h3>
            {assignResult.isError &&
                <h3 className="text-center text-red-900">{getAppError(assignResult.error)?.message}</h3>}
            <input
                value={doctorUsername}
                onChange={e => setDoctorUsername(e.target.value)}
                type="text"
                className={'w-full p-2 text-white bg-gray-800 dark:bg-gray-200 rounded-xl my-3 text-md'}
            />
            <div className="flex flex-wrap gap-3 justify-around">
                {doctors?.map(d => <div key={d.id} className={'border-2 border-blue-900 rounded-xl'}>
                    <div className="h-24">
                        <img src={PROFILE_IMAGES_URL + d.profilePhoto} alt=""
                             className="h-full w-full object-fit rounded-t-xl"/>
                    </div>
                    <div className="p-3 text-center">
                        <div> @{d.username} </div>
                        <div> NN:{d.nationalNumber} </div>
                        <div> {d.isComplete ?
                            <span className={'text-green-400'}>Complete</span> :
                            <span className="text-red-400">Not Complete</span>} </div>
                    </div>
                    <div className="flex justify-center">
                        <button className={'p-3 text-xl sm:text-lg'}
                                onClick={_ => {
                                    assign({
                                        sid: subjectId,
                                        did: d.id
                                    })
                                    closeModal()
                                }}
                        >Assign
                        </button>
                    </div>
                </div>)}
            </div>
        </div>
    );
};