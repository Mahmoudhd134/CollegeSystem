import {useParams} from "react-router-dom";
import {useDeleteStudentMutation, useGetStudentQuery} from "../../App/Api/StudentApi";
import AppLink from "../../Components/Navigation/AppLink";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import ProfileContainer from "../../Components/Profile/ProfileContainer";
import ProfileTitle from "../../Components/Profile/ProfileTitle";
import ProfileSection from "../../Components/Profile/ProfileSection";
import UseIsInRole from "../../Hookes/useIsInRole";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import {useEffect, useRef, useState} from "react";
import {useChangeProfilePhoto} from "../../App/Api/UserApi";
import UseAxiosApi from "../../Hookes/useAxiosApi";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {MyButton} from "../../Components/Form/MyButton";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import useAppSelector from "../../Hookes/useAppSelector";
import MyButtonAsLink from "../../Components/Form/MyButtonAsLink";

const StudentPage = () => {
    const {id} = useParams()
    const myId = useAppSelector(s => s.auth.id)
    const {data, isFetching, isSuccess, isError, error} = useGetStudentQuery((id!).toLowerCase() == 'me' ? myId! : id!)
    const profileImageRef = useRef<HTMLInputElement>(null)
    const api = UseAxiosApi()
    const dispatch = useAppDispatch()
    const changeProfilePhoto = useChangeProfilePhoto(api, dispatch)
    const [remove, removeResult] = useDeleteStudentMutation()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const navigator = useAppNavigator()

    const isInRole = UseIsInRole()
    const isAdmin = isInRole('admin')

    useEffect(() => {
        if (removeResult.isSuccess && removeResult.data)
            navigator('/Student')
    }, [removeResult.isSuccess])
    const handleChangeProfileImage = async () => {
        const file = profileImageRef.current?.files?.item(0)
        if (!file)
            return
        const formDate = new FormData()
        formDate.append('file', file)
        await changeProfilePhoto(formDate, id!)
    }

    let studentUi = <h3>Init Value</h3>
    if (isFetching)
        studentUi = <div className={'animated-pulse'}>
            <ProfileContainer>
                <ProfileTitle>
                    <div>
                        <img src={PROFILE_IMAGES_URL + data?.profilePhoto ?? 'default.png'} alt="profile_image"
                             className={'w-12 h-12 rounded-full inline'}/>
                        {data?.username ?? 'username'}
                    </div>
                    {isAdmin && <div className={'hover:cursor-pointer'}
                                     onClick={_ => {
                                         setConfirmDelete(true)
                                         window.scroll({
                                             top: 0,
                                             behavior: 'smooth'
                                         })
                                     }}
                    ><FontAwesomeIcon color='red' icon={faTrash}/></div>}
                </ProfileTitle>
                <ProfileSection>
                    <div>First Name: {data?.firstname ?? 'First Name'}</div>
                    <div>Last Name: {data?.lastname ?? 'Last Name'}</div>
                    <div>Department: {data?.department ?? 'Department'}</div>
                    <div>Email: {data?.email ?? 'Email'}</div>
                    <div>National Number: {data?.nationalNumber ?? 'National Number'}</div>
                    <div>Phone Number: {data?.phoneNumber ?? 'Phone Number'}</div>
                </ProfileSection>

                <ProfileTitle>Subjects</ProfileTitle>
                <ProfileSection>
                    <div className={'flex-sm1-md2-lg3-gap-3 justify-center'}>
                        {Array.from(Array(3).keys()).map(s => <div key={s}
                                                                   className={`border rounded-xl hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>
                            <img
                                src="/Images/subject.jpg"
                                alt="subjectImg"
                                className={'rounded-tr-xl rounded-tl-xl w-full'}
                            />
                            <div className="p-3 text-center">
                                <div className={'text-2xl'}>XX:123</div>
                                <div className={'text-xl sm:text-lg'}>name</div>
                            </div>
                        </div>)}
                    </div>
                </ProfileSection>
            </ProfileContainer>
        </div>

    if (isError && !isFetching)
        studentUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    if (isSuccess && data && !isFetching) studentUi = <>
        {confirmDelete && <div className={'border-2 rounded-xl p-3 text-center'}>
            <div>
                Are You Sure You Want To Delete '{data.username}' ?
            </div>
            <div className="flex flex-wrap gap-3 justify-around my-3">
                <MyButton type={'button'}
                          onClick={_ => {
                              remove(data.id)
                              setConfirmDelete(false)
                          }}>Delete</MyButton>

                <MyButton type={'button'}
                          onClick={_ => setConfirmDelete(false)}>Return Back</MyButton>
            </div>
        </div>}
        <ProfileTitle>
            <div>
                {data.isOwner ? <>
                        <img src={PROFILE_IMAGES_URL + data.profilePhoto} alt="profile_image"
                             className={'w-12 h-12 rounded-full inline hover:cursor-pointer'}
                             onClick={_ => profileImageRef.current?.click()}/>
                        <input type="file" className={'hidden'} ref={profileImageRef} onChange={handleChangeProfileImage}/>
                    </>
                    : <img src={PROFILE_IMAGES_URL + data.profilePhoto} alt="profile_image"
                           className={'w-12 h-12 rounded-full inline'}/>}
                {data.username}
            </div>
        </ProfileTitle>
        <ProfileSection>
            <div>First Name: {data.firstname}</div>
            <div>Last Name: {data.lastname}</div>
            <div>Department: {data.department}</div>
            <div>Email: {data.email}</div>
            <div>National Number: {data.nationalNumber}</div>
            <div>Phone Number: {data.phoneNumber}</div>
        </ProfileSection>

        <ProfileTitle>Actions</ProfileTitle>
        <ProfileSection>
            <div className="flex justify-around">
                {data.isOwner &&
                    <>
                        <MyButtonAsLink to={'/Student/Edit/' + data.id}><FontAwesomeIcon
                            icon={faPencil}/></MyButtonAsLink>
                        <MyButtonAsLink to={'/User/ChangePassword'}>Change Password</MyButtonAsLink>
                    </>
                }
                {isAdmin && <div className={'hover:cursor-pointer'}
                                 onClick={_ => {
                                     setConfirmDelete(true)
                                     window.scroll({
                                         top: 0,
                                         behavior: 'smooth'
                                     })
                                 }}
                >
                    <MyButton type={'button'}>
                        <FontAwesomeIcon color='red' icon={faTrash}/>
                    </MyButton>
                </div>}
            </div>
        </ProfileSection>

        <ProfileTitle>Subjects</ProfileTitle>
        <ProfileSection>
            <div className={'flex-sm1-md2-lg3-gap-3 justify-center'}>
                {data.subjects.map(s => <AppLink to={'/Subject/' + s.code} key={s.id}
                                                 className={`border rounded-xl hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>
                    <img
                        src="/Images/subject.jpg"
                        alt="subjectImg"
                        className={'rounded-tr-xl rounded-tl-xl w-full'}
                    />
                    <div className="p-3 text-center">
                        <div className={'text-2xl'}>{s.department.toUpperCase()}{s.code}</div>
                        <div className={'text-xl sm:text-lg'}>{s.name}</div>
                    </div>
                </AppLink>)}
            </div>
        </ProfileSection>
    </>

    return <div className={'my-container'}>
        <ProfileContainer>
            {studentUi}
        </ProfileContainer>
    </div>
};

export default StudentPage;