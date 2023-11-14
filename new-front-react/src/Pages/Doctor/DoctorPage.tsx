import {useParams} from "react-router-dom";
import {BASE_URL} from "../../App/Api/axiosApi";
import {useGetDoctorQuery} from "../../App/Api/DoctorApi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import DoctorNotFound from "./DoctorNotFound";
import AppLink from "../../Components/Navigation/AppLink";
import getAppError from "../../Utilites/getAppError";
import React, {useRef, useState} from "react";
import {useChangeProfilePhoto} from "../../App/Api/UserApi";
import useAxiosApi from "../../Hookes/useAxiosApi";
import useAppDispatch from "../../Hookes/useAppDispatch";
import useIsInRole from "../../Hookes/useIsInRole";
import ProfileContainer from "../../Components/Profile/ProfileContainer";
import ProfileTitle from "../../Components/Profile/ProfileTitle";
import ProfileSection from "../../Components/Profile/ProfileSection";
import MyButtonAsLink from "../../Components/Form/MyButtonAsLink";

const DoctorPage = () => {
    const {id} = useParams()
    const {data: doctor, isFetching, isError, error} = useGetDoctorQuery((id?.toLowerCase() ?? '') != 'me' ? id! : '')
    const api = useAxiosApi()
    const dispatch = useAppDispatch()
    const changeProfilePhoto = useChangeProfilePhoto(api, dispatch)
    const navigator = useAppNavigator()
    const imgInput = useRef<HTMLInputElement>(null);
    const [err, setErr] = useState('');
    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')

    // let doctor:typeof data
    // if(data)
    //     doctor = {...data,subjects:[...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects,...data.subjects]}

    const changeProfileImgHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        if (!file)
            return
        const formData = new FormData()
        formData.append('file', file)
        const result = await changeProfilePhoto(formData, doctor?.id!)
        setErr(result.data.message)
    }

    const fileTypesCount = Object
        .keys(SubjectFileTypes)
        .filter(t => !isNaN(Number(t)))
        .length


    const hasDone = doctor?.subjects
        .map(s => s.numberOfFilesTypes === fileTypesCount)
        .filter(s => s === true)
        .length

    let per = Math.floor((hasDone ?? 1) / (doctor?.subjects.length ?? 1) * 100) ?? 0
    if (per == 0)
        per = 25

    const maxFileTypes = Object.values(SubjectFileTypes).map(Number).filter(isNaN).length
    const progressBar = <div className="w-full rounded-full bg-gray-700 relative">
        <div className={`bg-blue-600 leading-none rounded-full h-full p-1 text-center`}
             style={{width: per + '%'}}
        >{hasDone}/{doctor?.subjects.length}
        </div>
    </div>

    const docSection = <div className="my-container">
        <ProfileContainer>
            <ProfileTitle>{doctor?.firstname + ' ' + doctor?.lastname}</ProfileTitle>
            <ProfileSection>
                <>
                    {doctor?.isOwner ?
                        <>
                            <input type="file"
                                   accept='image/*'
                                   className={'hidden'}
                                   ref={imgInput}
                                   onChange={changeProfileImgHandler}/>
                            <img className={'h-48 w-fit self-center object-contain rounded-full hover:cursor-pointer'}
                                 src={BASE_URL.slice(0, BASE_URL.length - 4) + '/profileImages/' + doctor?.profilePhoto}
                                 alt="profile_photo"
                                 onClick={_ => imgInput.current?.click()}
                            />
                        </> :
                        <img className={'h-48 w-fit self-center object-contain rounded-full'}
                             src={BASE_URL.slice(0, BASE_URL.length - 4) + '/profileImages/' + doctor?.profilePhoto}
                             alt="profile_photo"/>}
                    <div>First Name: {doctor?.firstname}</div>
                    <div>Last Name: {doctor?.lastname}</div>
                    <div>Email: {doctor?.email}</div>
                    <div>National Number: {doctor?.nationalNumber}</div>
                    <div>Phone Number: {doctor?.phoneNumber}</div>
                    <div className={doctor?.isComplete ? 'text-green-500' : 'text-red-500'}>
                        Is Complete: {doctor?.isComplete ? 'Yes' : 'No'}
                    </div>
                    <div>{progressBar}</div>
                </>
            </ProfileSection>

            <ProfileTitle>Actions</ProfileTitle>
            <ProfileSection>
                <div className="flex flex-wrap justify-around items-center gap-3">
                    <a href={'#Subjects'}
                       className={'bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 border border-blue-600 rounded-2xl p-3 transition-all hover:shadow-xl hover:shadow-blue-200 '}
                    >Files</a>
                    <MyButtonAsLink to={'/Doctor/Report/' + doctor?.id}>
                        Report
                    </MyButtonAsLink>
                    {doctor?.isOwner &&
                        <>
                            <MyButtonAsLink to={'/User/ChangePassword'}>
                                Change Password
                            </MyButtonAsLink>
                            <MyButtonAsLink to={'/Doctor/Edit/' + doctor.id}>
                                Edit
                            </MyButtonAsLink>
                        </>
                    }
                    {isAdmin && <MyButtonAsLink to={`/Message/Add?userName=${doctor?.username}&id=${doctor?.id}`}>Send Message</MyButtonAsLink>}
                </div>
            </ProfileSection>
        </ProfileContainer>
    </div>

    const subjectSection = <div className="my-container">
        <ProfileContainer>
            <ProfileTitle>Subjects</ProfileTitle>
            <ProfileSection>
                {doctor?.subjects.length == 0 && <div
                    className={`w-5/6 sm:w-4/6 md:w-3/6 lg:w-2/6 mx-auto p-4 text-red-600 text-center bg-red-50 rounded-2xl shadow`}>
                    <h3 className={'text-2xl sm:text-xl'}>No Subjects Assigned To This Doctor!!</h3>
                    <p className={'text-xl sm:text-lg my-1 text-red-500'}>This doctor has no subject, you can go to any
                        subject
                        that has no doctor and assign it to this doctor</p>
                </div>}

                <div className="flex-1-2-3-gap-3 justify-center w-full">
                    {doctor?.subjects.map(s => <AppLink to={'/Subject/' + s.code} key={s.id}
                                                        className={`border rounded-xl ${(isAdmin || isDoctor) ? (maxFileTypes == s.numberOfFilesTypes ? 'border-green-800' : 'border-red-800') : 'border-gray-800'} hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>
                        <img
                            src="/Images/subject.jpg"
                            alt="subjectImg"
                            className={'rounded-tr-xl rounded-tl-xl w-full'}
                        />
                        <div className="p-3 text-center">
                            <div className={'text-2xl'}>{s.department.toUpperCase()}{s.code}</div>
                            <div className={'text-xl sm:text-lg'}>{s.name}</div>
                            {(isAdmin || isDoctor) &&
                                <div className={'text-lg sm:text-md'}>{s.numberOfFilesTypes}/{maxFileTypes}</div>}
                        </div>
                    </AppLink>)}
                </div>
            </ProfileSection>
        </ProfileContainer>
    </div>

    if (isFetching) {
        const x = <div className="flex-1-2-3-gap-3 justify-center w-full animate-pluse">
            <div
                className={`border-2 bg-blue-100 p-5 text-center flex flex-col justify-center items-center gap-3 rounded-xl hover:shadow-xl transition-all hover:cursor-pointer`}>
                <div className={'h-2'}></div>
                <div className={'h-2'}></div>
                <div className={'h-2'}></div>
            </div>
        </div>
        const tempSubjects = []
        for (let i = 0; i < 5; i++)
            tempSubjects.push(x)
        return <div
            className="bg-gradient-to-b from-blue-300 to-blue-200 min-h-remaining text-gray-900 flex flex-col justify-center items-center animate-pulse">
            <div className="container min-h-remaining mx-auto p-4 flex flex-col items-center">
                <div
                    className="w-48 h-16 mb-0 sm:mb-5 bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 rounded-xl transition flex justify-center items-center mt-1"
                >
                </div>
                <div
                    className="flex items-center justify-center h-48 w-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600 rounded-full" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path
                            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                    </svg>
                </div>
                <div className="w-48 flex-col gap-3">
                    <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-1"></p>
                    <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-1"></p>
                    <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-1"></p>
                    <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-1"></p>
                    <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-1"></p>
                </div>
                {/*{filesLink}*/}
            </div>
            <div className="container mx-auto min-h-remaining p-4" id={'Subjects'}>
                <div className="flex-1-2-3-gap-3 justify-center w-full">
                    {tempSubjects.map((x, i) => <div key={i}>{x}</div>)}
                </div>
            </div>
        </div>
    }

    if (isError)
        return <DoctorNotFound id={id ?? 'un known'} error={getAppError(error)!}/>

    return (<>
        <div className="bg-gradient-to-b from-blue-300 to-blue-200 min-h-remaining text-gray-900 flex items-center">
            {err?.length > 0 && <h3 className="text-2xl text-center text-red-900">{err}</h3>}
            {docSection}
        </div>

        <div className="bg-gradient-to-b from-blue-300 to-blue-200 min-h-remaining" id={'Subjects'}>
            {subjectSection}
        </div>
    </>)
}
export default DoctorPage