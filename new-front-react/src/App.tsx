import useAppDispatch from "./Hookes/useAppDispatch";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useRefreshToken from "./Hookes/useRefreshToken";
import {logout, setCredentials} from "./App/Feutures/Auth/authSlice";
import TokenModel from "./App/Models/Auth/TokenModel";
import Home from "./Pages/Home";
import Layout from "./Pages/Layout";
import PathNotFound from "./Pages/NotFound/PathNotFound";
import Login from "./Pages/Login";
import DoctorList from "./Pages/Doctor/DoctorList";
import RouteProtector from "./Components/Global/RouteProtector";
import {baseApi} from "./App/Api/BaseApi";
import AddDoctor from "./Pages/Doctor/AddDoctor";
import AdminDashboard from "./Pages/AdminDashboard";
import DoctorPage from "./Pages/Doctor/DoctorPage";
import EditDoctor from "./Pages/Doctor/EditDoctor";
import ChangePassword from "./Pages/User/ChangePassword";
import DoctorReport from "./Pages/Doctor/DoctorReport";
import SubjectList from "./Pages/Subject/SubjectList";
import AddSubject from "./Pages/Subject/AddSubject";
import SubjectPage from "./Pages/Subject/SubjectPage";
import SubjectWithStudents from "./Pages/Subject/SubjectWithStudents";
import SubjectWithFiles from "./Pages/Subject/SubjectWithFiles";
import SubjectReport from "./Pages/Subject/SubjectReport";
import AddMail from "./Pages/Mail/AddMail";
import Mail from "./Pages/Mail/Mail";
import MailsLayout from "./Pages/Mail/MailsLayout";
import SentMails from "./Pages/Mail/SentMails";
import InboxMails from "./Pages/Mail/InboxMails";
import EditSubject from "./Pages/Subject/EditSubject";
import SubjectFileTypeTemplates from "./Pages/Subject/SubjectFileTypeTemplates";
import AddStudent from "./Pages/Studnet/AddStudent";
import StudentList from "./Pages/Studnet/StudentList";
import StudentPage from "./Pages/Studnet/StudentPage";
import EditStudent from "./Pages/Studnet/EditStudent";
import AddRoom from "./Pages/Room/AddRoom";
import Room from "./Pages/Room/Room";
import {
    addNewMessageNotification,
    buildAppConnection, getDelayedMessagesInfo,
    startAppConnection,
    stopAppConnection
} from "./App/Feutures/App/AppSlice";
import useAppSelector from "./Hookes/useAppSelector";
import NewMessageNotificationModel from "./App/Models/App/NewMessageNotificationModel";
import Notifications from "./Pages/Notifications";
import useAxiosApi from "./Hookes/useAxiosApi";

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