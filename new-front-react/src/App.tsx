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
                    navigator(loc.pathname)
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

                <Route path='doctor' element={<RouteProtector allowedRoles={[]}/>}>
                    <Route path={':id'} element={<DoctorPage/>}/>
                </Route>

                <Route path={'AdminDashboard'} element={<RouteProtector allowedRoles={['admin']}/>}>
                    <Route index element={<AdminDashboard/>}/>
                </Route>

                <Route path='*' element={<PathNotFound/>}/>
            </Route>
        </Routes>)
}

export default App
