import Navbar from "../Components/Global/Navbar";
import {Outlet, useLocation} from "react-router-dom";
import {Suspense} from "react";
import Welcome from "../Components/Global/Welcome";

const Layout = () => {
    const loc = useLocation()
    const path = loc.pathname
    return (<>
        <Navbar/>

        <Suspense fallback={<Welcome path={path}/>}>
            <Outlet/>
        </Suspense>
    </>)
}

export default Layout