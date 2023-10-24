import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAppSelector from "../../Hookes/useAppSelector";
import Forbidden403 from "../Forbidden/Forbidden403";

const RouteProtector = (props: { allowedRoles: string[] }) => {
    const {token, roles} = useAppSelector(s => s.auth)
    const loc = useLocation()
    const errors = [
        {
            title: 'ERROR CODE',
            text: 'HTTP 403 Forbidden'
        },
        {
            title: 'ERROR DESCRIPTION',
            text: 'Access Denied. You Do Not Have The Permission To Access This Page On This Server'
        },
        {
            title: 'ERROR POSSIBLY CAUSED BY',
            text: '[execute access forbidden, read access forbidden, write access forbidden, ssl required, ssl 128 required, ip address rejected, client certificate required, site access denied, too many users, invalid configuration, password change, mapper denied access, client certificate revoked, directory listing denied, client access licenses exceeded, client certificate is untrusted or invalid, client certificate has expired or is not yet valid, passport logon failed, source access denied, infinite depth is denied, too many requests from the same client ip...]'
        },
        {
            title: 'SOME PAGES ON THIS SERVER THAT YOU DO HAVE PERMISSION TO ACCESS',
            text: '[Home Page, Doctor...]'
        },
        {
            title: 'HAVE A NICE DAY SIR ',
            text: '-)'
        }
    ]

    return token ?
        props.allowedRoles.length > 0 ?
            roles?.some(r => props.allowedRoles.some(ar => ar.trim().toLowerCase() === r.trim().toLowerCase())) ?
                <Outlet/> :
                <Forbidden403 errors={errors}/>
            : <Outlet/>
        : <Navigate to={'/login'} state={{from: loc}}/>


};

export default RouteProtector;