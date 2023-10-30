import useAppDispatch from "./Hookes/useAppDispatch";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useRefreshToken from "./Hookes/useRefreshToken";
import {logout, setCredentials} from "./Feutures/Auth/authSlice";
import TokenModel from "./Models/Auth/TokenModel";
import Home from "./Pages/Home";
import Layout from "./Pages/Layout";
import PathNotFound from "./Pages/NotFound/PathNotFound";
import Login from "./Pages/Login";
import DoctorList from "./Pages/DoctorPages/DoctorList";
import RouteProtector from "./Components/Global/RouteProtector";
import {baseApi} from "./App/Api/BaseApi";
import AddDoctor from "./Pages/DoctorPages/AddDoctor";
import AdminDashboard from "./Pages/AdminDashboard";
import DoctorPage from "./Pages/DoctorPages/DoctorPage";
import EditDoctor from "./Pages/DoctorPages/EditDoctor";
import ChangePassword from "./Pages/DoctorPages/ChangePassword";
import DoctorReport from "./Pages/DoctorPages/DoctorReport";
import SubjectList from "./Pages/SubjectPages/SubjectList";

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

                <Route path='doctor' element={<RouteProtector allowedRoles={['admin']}/>}>
                    <Route path='list' element={<DoctorList/>}/>
                    <Route path='add' element={<AddDoctor/>}/>
                </Route>

                <Route path='doctor' element={<RouteProtector allowedRoles={['admin','doctor']}/>}>
                    <Route path={':id'} element={<DoctorPage/>}/>
                    <Route path={'report/:id'} element={<DoctorReport/>}/>
                </Route>
                
                <Route path='doctor' element={<RouteProtector allowedRoles={['doctor']}/>}>
                    <Route path={'edit/:id'} element={<EditDoctor/>}/>
                    <Route path={'changePassword'} element={<ChangePassword/>}/>
                </Route>

                <Route path='subject' element={<RouteProtector allowedRoles={[]}/>}>
                    <Route index element={<SubjectList/>}/>
                </Route>

                <Route path={'AdminDashboard'} element={<RouteProtector allowedRoles={['admin']}/>}>
                    <Route index element={<AdminDashboard/>}/>
                </Route>

                <Route path='*' element={<PathNotFound/>}/>
            </Route>
        </Routes>)
}

export default App
