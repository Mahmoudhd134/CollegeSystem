import {useParams} from "react-router-dom";
import {BASE_URL} from "../../App/Api/axiosApi";
import {useGetDoctorQuery} from "../../App/Api/DoctorApi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import useAppSelector from "../../Hookes/useAppSelector";
import DoctorNotFound from "./DoctorNotFound";
import AppLink from "../../Components/Navigation/AppLink";
import getAppError from "../../Utilites/getAppError";

const DoctorPage = () => {
    const {id} = useParams()
    const {data: doctor, isFetching, isError, error} = useGetDoctorQuery((id?.toLowerCase() ?? '') != 'me' ? id! : '')
    const navigator = useAppNavigator()

    const fileTypesCount = Object
        .keys(SubjectFileTypes)
        .filter(t => !isNaN(Number(t)))
        .length


    const hasDone = doctor?.subjects
        .map(s => s.numberOfFilesTypes === fileTypesCount)
        .filter(s => s === true)
        .length

    const per = Math.floor((hasDone ?? 1) / (doctor?.subjects.length ?? 1) * 100)

    const progressBar = <div className="w-full rounded-full bg-gray-700 relative">
        <div className={`bg-blue-600 leading-none rounded-full h-full p-1`}
             style={{width: per + 50 + '%'}}
        >{hasDone}/{doctor?.subjects.length}
        </div>
    </div>

    const filesLink = <a href={'#Files'}
                         className={'w-32 h-16 p-4 bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 transition rounded-3xl flex justify-around items-center mt-8 text-xl hover:-translate-y-1 group hover:text-white'}>
        <FontAwesomeIcon icon={faArrowDown}
                         className={'text-blue-500 group-hover:translate-y-2 transition'}/>
        Files
        <FontAwesomeIcon icon={faArrowDown}
                         className={'text-blue-500 group-hover:translate-y-2 transition'}/>
    </a>

    const docInfo = <div className={'text-center text-anywhere'}>
        <div className={'text-2xl sm:text-xl'}>
            <div>
                NN: {doctor?.nationalNumber}
            </div>
            <div>
                {doctor?.firstname} {doctor?.lastname}
            </div>
        </div>

        <div className="text-3xl sm:text-2xl">
            <b>#</b>{doctor?.username}
        </div>
        <div className="text-xl sm:text-lg">
            <div>
                {doctor?.email}
            </div>
            <div>
                {doctor?.phoneNumber}
            </div>
        </div>
        {progressBar}
    </div>

    const docSection = <div className="container mx-auto p-4 flex flex-col items-center">
        <button
            className="w-48 h-16 mb-0 sm:mb-5 bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 rounded-xl transition"
            onClick={e => navigator('/doctor/report/' + doctor?.id)}
        >Report
        </button>
        {doctor?.isOwner &&
            <>
                <AppLink
                    className="w-48 h-16 mb-0 sm:mb-5 bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 rounded-xl transition flex justify-center items-center"
                    to={'/doctor/changePassword'}
                >
                    Change Password
                </AppLink>
                <AppLink
                    to={'/doctor/edit/' + doctor.id}
                    className="w-48 h-16 mb-0 sm:mb-5 bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 rounded-xl transition flex justify-center items-center mt-1"
                >
                    Edit
                </AppLink>
            </>
        }
        <div
            className={`h-52 w-52 border-2 ${doctor ? doctor.isComplete ? 'border-green-500' : 'border-red-500' : 'border-black'} overflow-hidden flex flex-col p-4 my-2 justify-center items-center rounded-lg`}>
            {doctor && (doctor.isComplete ?
                <div className={'text-green-500 text-2xl sm:text-xl'}>Done</div> :
                <div className={'text-red-500 text-2xl sm:text-xl'}>Not Done</div>)}
            <img
                className={'h-48 w-48 object-contain rounded-full'}
                src={BASE_URL.slice(0, BASE_URL.length - 4) + '/profileImages/' + doctor?.profilePhoto}
                alt="profile_photo"/>
        </div>
        {docInfo}
        {filesLink}
    </div>

    const subjectSection = <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-2xl sm:text-xl my-3">
            Subjects
        </h1>

        {doctor?.subjects.length == 0 && <div
            className={`w-5/6 sm:w-4/6 md:w-3/6 lg:w-2/6 mx-auto p-4 text-red-600 text-center bg-red-50 rounded-2xl shadow`}>
            <h3 className={'text-2xl sm:text-xl'}>No Subjects Assigned To This Doctor!!</h3>
            <p className={'text-xl sm:text-lg my-1 text-red-500'}>This doctor has no subject, you can go to any subject
                that has no doctor and assign it to this doctor</p>
        </div>}

        <div className="flex-1-2-3-gap-3 justify-center w-full">
            {doctor?.subjects.map(s => <div key={s.id}
                                            className={`border-2 ${s.numberOfFilesTypes === fileTypesCount ? 'border-green-500' : 'border-red-500'} bg-blue-100 p-5 text-center flex flex-col justify-center items-center gap-3 rounded-xl hover:shadow-xl transition-all hover:cursor-pointer`}
                                            onClick={e => navigator('/subjects/' + s.code)}>
                <div className={'text-2xl sm:text-xl justify-start'}>{s.name}</div>
                <div>{s.department}{s.code}</div>
                <div>{s.numberOfFilesTypes}/{fileTypesCount}</div>
            </div>)}
        </div>
    </div>

    if (isFetching)
        return <h3>Loading...</h3>

    if (isError)
        return <DoctorNotFound id={id ?? 'un known'} error={getAppError(error)!}/>

    return (<>
        <div className="bg-gradient-to-b from-blue-300 to-blue-200 min-h-remaining text-gray-900 flex items-center">
            {docSection}
        </div>

        <div className="bg-gradient-to-b from-blue-300 to-blue-200 min-h-remaining" id={'Files'}>
            {subjectSection}
        </div>
    </>)
}
export default DoctorPage