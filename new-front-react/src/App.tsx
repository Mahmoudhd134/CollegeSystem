import useAppDispatch from "./Hookes/useAppDispatch";
import {Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useRefreshToken from "./Hookes/useRefreshToken";
import {logout, setCredentials} from "./Feutures/Auth/authSlice";
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
import ChangePassword from "./Pages/Doctor/ChangePassword";
import DoctorReport from "./Pages/Doctor/DoctorReport";
import SubjectList from "./Pages/Subject/SubjectList";
import AddSubject from "./Pages/Subject/AddSubject";
import SubjectPage from "./Pages/Subject/SubjectPage";
import SubjectWithStudents from "./Pages/Subject/SubjectWithStudents";
import SubjectWithFiles from "./Pages/Subject/SubjectWithFiles";
import SubjectReport from "./Pages/Subject/SubjectReport";
import AddMessage from "./Pages/Message/AddMessage";
import MessagesLayout from "./Pages/Message/MessagesLayout";
import SentMessages from "./Pages/Message/SentMessages";
import ReceivedMessages from "./Pages/Message/ReceivedMessages";
import Message from "./Pages/Message/Message";
import EditSubject from "./Pages/Subject/EditSubject";

function App() {
    const stayLogin = JSON.parse(localStorage.getItem('stayLogin') ?? 'false')
    const dispatch = useAppDispatch()
    const loc = useLocation()
    const navigator = useNavigate()

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
    }, [])


    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>

                <Route path='login' element={<Login/>}/>

                <Route path='doctor'>
                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route index element={<DoctorList/>}/>
                        <Route path='add' element={<AddDoctor/>}/>
                    </Route>

                    <Route element={<RouteProtector allowedRoles={['doctor']}/>}>
                        <Route path={'edit/:id'} element={<EditDoctor/>}/>
                        <Route path={'changePassword'} element={<ChangePassword/>}/>
                    </Route>


                    <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>
                        <Route path={':id'} element={<DoctorPage/>}/>
                        <Route path={'report/:id'} element={<DoctorReport/>}/>
                    </Route>
                </Route>

                <Route path='subject'>
                    <Route index element={<SubjectList/>}/>

                    <Route path={':code'} element={<RouteProtector allowedRoles={[]}/>}>
                        <Route index element={<SubjectPage/>}/>

                        <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>
                            <Route path={'students'} element={<SubjectWithStudents/>}/>
                            <Route path={'files'} element={<SubjectWithFiles/>}/>
                            <Route path={'report'} element={<SubjectReport/>}/>
                        </Route>
                    </Route>

                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route path='add' element={<AddSubject/>}/>
                        <Route path='edit/:code' element={<EditSubject/>}/>
                    </Route>
                </Route>

                <Route path='message'>
                    <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                        <Route path='add' element={<AddMessage/>}/>
                    </Route>

                    <Route element={<MessagesLayout/>}>
                        <Route element={<RouteProtector allowedRoles={['admin', 'doctor']}/>}>

                            <Route element={<RouteProtector allowedRoles={['admin']}/>}>
                                <Route path='sent' element={<SentMessages/>}/>
                            </Route>

                            <Route path='received' element={<ReceivedMessages/>}/>
                        </Route>
                    </Route>
                    
                    <Route path=':id' element={<Message/>}/>
                </Route>

                <Route path={'AdminDashboard'} element={<RouteProtector allowedRoles={['admin']}/>}>
                    <Route index element={<AdminDashboard/>}/>
                </Route>

                <Route path='*' element={<PathNotFound/>}/>
            </Route>
        </Routes>)
}

export default App