import useAppDispatch from "./Hookes/useAppDispatch";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {lazy, useEffect} from "react";
import useRefreshToken from "./Hookes/useRefreshToken";
import {logout, setCredentials} from "./App/Feutures/Auth/authSlice";
import TokenModel from "./App/Models/Auth/TokenModel";
import {baseApi} from "./App/Api/BaseApi";
import RouteProtector from "./Components/Global/RouteProtector";

const Home = lazy(() => import(  "./Pages/Home"));
const Layout = lazy(() => import(  "./Pages/Layout"));
const PathNotFound = lazy(() => import(  "./Pages/NotFound/PathNotFound"));
const Login = lazy(() => import(  "./Pages/Login"));
const DoctorList = lazy(() => import(  "./Pages/Doctor/DoctorList"));

const AddDoctor = lazy(() => import( "./Pages/Doctor/AddDoctor"));
const AdminDashboard = lazy(() => import( "./Pages/AdminDashboard"));
const DoctorPage = lazy(() => import( "./Pages/Doctor/DoctorPage"));
const EditDoctor = lazy(() => import( "./Pages/Doctor/EditDoctor"));
const ChangePassword = lazy(() => import( "./Pages/User/ChangePassword"));
const DoctorReport = lazy(() => import( "./Pages/Doctor/DoctorReport"));
const SubjectList = lazy(() => import( "./Pages/Subject/SubjectList"));
const AddSubject = lazy(() => import( "./Pages/Subject/AddSubject"));
const SubjectPage = lazy(() => import( "./Pages/Subject/SubjectPage"));
const SubjectWithStudents = lazy(() => import( "./Pages/Subject/SubjectWithStudents"));
const SubjectWithFiles = lazy(() => import( "./Pages/Subject/SubjectWithFiles"));
const SubjectReport = lazy(() => import( "./Pages/Subject/SubjectReport"));
const AddMail = lazy(() => import( "./Pages/Mail/AddMail"));
const Mail = lazy(() => import( "./Pages/Mail/Mail"));
const MailsLayout = lazy(() => import( "./Pages/Mail/MailsLayout"));
const SentMails = lazy(() => import( "./Pages/Mail/SentMails"));
const InboxMails = lazy(() => import( "./Pages/Mail/InboxMails"));
const EditSubject = lazy(() => import( "./Pages/Subject/EditSubject"));
const SubjectFileTypeTemplates = lazy(() => import( "./Pages/Subject/SubjectFileTypeTemplates"));
const AddStudent = lazy(() => import( "./Pages/Student/AddStudent"));
const StudentList = lazy(() => import( "./Pages/Student/StudentList"));
const StudentPage = lazy(() => import( "./Pages/Student/StudentPage"));
const EditStudent = lazy(() => import( "./Pages/Student/EditStudent"));
const AddRoom = lazy(() => import( "./Pages/Room/AddRoom"));
const Room = lazy(() => import( "./Pages/Room/Room"));
import {
    addNewMessageNotification,
    buildAppConnection, getDelayedMessagesInfo,
    startAppConnection,
    stopAppConnection
} from "./App/Feutures/App/AppSlice";
import useAppSelector from "./Hookes/useAppSelector";
import Notifications from "./Pages/Notifications";
import useAxiosApi from "./Hookes/useAxiosApi";
import NewMessageNotificationModel from "./App/Models/App/NewMessageNotificationModel";
import {deleteMessage} from "./App/Feutures/Room/roomSlice";

function App() {
    const stayLogin = JSON.parse(localStorage.getItem('stayLogin') ?? 'false')
    const dispatch = useAppDispatch()
    const loc = useLocation()
    const navigator = useNavigate()
    const token = useAppSelector(s => s.auth.token)
    const connection = useAppSelector(s => s.app.connection)
    const api = useAxiosApi()

    useEffect(() => {
        if (!token)
            return
        dispatch(getDelayedMessagesInfo({api}))
    }, [token])

    useEffect(() => {
        if (stayLogin) {
            (async () => {
                const refresh = useRefreshToken()
                const data = await refresh()
                dispatch(baseApi.util.resetApiState())
                if (data) {
                    dispatch(setCredentials(data as TokenModel))
                    navigator(loc)
                } else {
                    dispatch(logout())
                }
            })()
        }
    }, [dispatch])

    useEffect(() => {
        if (!token)
            return
        dispatch(buildAppConnection({token}))
        dispatch(startAppConnection())
        return () => {
            dispatch(stopAppConnection())
        }
    }, [token, dispatch])


    useEffect(() => {
        if (!connection)
            return

        connection.on("ReceiveNewMessageNotification", (newMessageNotification: NewMessageNotificationModel) => {
            dispatch(addNewMessageNotification(newMessageNotification))
        })

        connection.on('DeleteMessage', (roomId: string, messageId: string) => {
            dispatch(deleteMessage({roomId, messageId}))
        })
    }, [connection])

    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>

                <Route path='login' element={<Login/>}/>

                <Route path='user' element={<RouteProtector allowedRoles={[]}/>}>
                    <Route path={'changePassword'} element={<ChangePassword/>}/>
                </Route>

                <Route path='doctor'>
                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route index element={<DoctorList/>}/>
                        <Route path='add' element={<AddDoctor/>}/>
                    </Route>

                    <Route element={<RouteProtector allowedRoles={['doctor']}/>}>
                        <Route path={'edit/:id'} element={<EditDoctor/>}/>
                    </Route>


                    <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>
                        <Route path={':id'} element={<DoctorPage/>}/>
                        <Route path={'report/:id'} element={<DoctorReport/>}/>
                    </Route>
                </Route>

                <Route path='subject' element={<RouteProtector allowedRoles={[]}/>}>
                    <Route index element={<SubjectList/>}/>

                    <Route path={':code'}>
                        <Route index element={<SubjectPage/>}/>

                        <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>
                            <Route path={'students'} element={<SubjectWithStudents/>}/>
                            <Route path={'files'} element={<SubjectWithFiles/>}/>
                            <Route path={'report'} element={<SubjectReport/>}/>
                        </Route>

                        <Route element={<RouteProtector allowedRoles={['doctor']}/>}>
                            <Route path='addRoom/:id' element={<AddRoom/>}/>
                        </Route>
                    </Route>

                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route path='add' element={<AddSubject/>}/>
                        <Route path='edit/:code' element={<EditSubject/>}/>
                        <Route path='templates' element={<SubjectFileTypeTemplates/>}/>
                    </Route>
                </Route>

                <Route path='mail'>
                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route path='add' element={<AddMail/>}/>
                    </Route>

                    <Route element={<MailsLayout/>}>
                        <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>

                            <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                                <Route path='sent' element={<SentMails/>}/>
                            </Route>
                            <Route path='inbox' element={<InboxMails/>}/>
                        </Route>
                    </Route>

                    <Route path=':id' element={<Mail/>}/>
                </Route>

                <Route path='student' element={<RouteProtector allowedRoles={[]}/>}>
                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route index element={<StudentList/>}/>
                        <Route path='add' element={<AddStudent/>}/>
                    </Route>

                    <Route path=':id' element={<StudentPage/>}/>
                    <Route element={<RouteProtector allowedRoles={['student']}/>}>
                        <Route path='edit/:id' element={<EditStudent/>}/>
                    </Route>
                </Route>

                <Route path={'room'} element={<RouteProtector allowedRoles={[]}/>}>
                    <Route path=':id' element={<Room/>}/>
                </Route>

                <Route path={'AdminDashboard'} element={<RouteProtector allowedRoles={['admin']}/>}>
                    <Route index element={<AdminDashboard/>}/>
                </Route>

                <Route path={'notifications'} element={<RouteProtector allowedRoles={[]}/>}>
                    <Route index element={<Notifications/>}/>
                </Route>

                <Route path='*' element={<PathNotFound/>}/>
            </Route>
        </Routes>)
}

export default App