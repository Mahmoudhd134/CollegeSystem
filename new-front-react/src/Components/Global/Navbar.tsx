import useAppSelector from "../../Hookes/useAppSelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faX} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {logout} from "../../Feutures/Auth/authSlice";
import './navbar.css'
import AppLink from "../Navigation/AppLink";
import {useLazyGetIsHasUnReadMessagesQuery} from "../../App/Api/MessageApi";

const Navbar = () => {
    const token = useAppSelector(s => s.auth.token)
    const [showMobMenu, setShowMobMenu] = useState(false)
    const dispatch = useAppDispatch()
    const [get, {data: hasUnReadMessages}] = useLazyGetIsHasUnReadMessagesQuery()
    useEffect(() => {
        get()
    }, [token])

    const isInRole = ((roles: string[] | null) => (role: string) =>
        roles?.some(x => x.toLowerCase() === role.toLowerCase()))(useAppSelector(s => s.auth.roles))

    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')

    const redNotifyIconClasses = hasUnReadMessages ? 'absolute top-0 right-0 opacity-75 w-4 h-4 rounded-full bg-red-900 dark:bg-red-900' : ''
    const mobLink = (link: string, text: string) =>
        <AppLink to={link} className='nav-bar-mobile-link'>{text}</AppLink>
    const navBarLink = (link: string, text: string) =>
        <AppLink to={link} className='nav-bar-non-mobile-link'>{text}</AppLink>

    const mobMenu = <div
        className='nav-bar-mobile-menu'
        onClick={e => setShowMobMenu(false)}
    >
        <div className="self-end -translate-x-1 translate-y-1 text-3xl text-white mb-3">
            <FontAwesomeIcon className={'hover:cursor-pointer'} icon={faX}/>
        </div>

        {/*Mob Links Here*/}
        {isAdmin && mobLink('/AdminDashboard', 'Admin Dashboard')}
        {isDoctor && mobLink('/doctor/me', 'Profile')}
        <span>
            {mobLink('/Message/Received', 'Messages')}
        </span>
        {mobLink('/Subject', 'Subjects')}

        {token ? <div
            className={'nav-bar-mobile-link text-red-600 hover:text-red-800 hover:cursor-pointer'}
            onClick={e => dispatch(logout())}
        >SignOut</div> : mobLink('/login', 'Login')}
    </div>

    const mobMenuButton = <div className="block sm:hidden ml-auto mr-1 text-3xl hover:cursor-pointer">
        <FontAwesomeIcon icon={faBars}
                         onClick={e => setShowMobMenu(true)}
        />
    </div>

    return (<nav className={'nav-bar no-print'}>
        <div className="container mx-auto p-4 flex items-baseline">
            <AppLink to={'/'}
                     className={'text-3xl sm:text-2xl hover:text-blue-700 transition-all'}>Home</AppLink>

            {showMobMenu ? mobMenu : mobMenuButton}

            <div className="hidden sm:flex ml-auto gap-3">
                {/*Non-Mob Links */}
                {isAdmin && navBarLink('/AdminDashboard', 'AdminDashboard')}

                {isDoctor && navBarLink('/doctor/me', 'Profile')}
                <span className={'relative'}>
                   <span className={redNotifyIconClasses}></span>
                    {navBarLink('/Message/Received', 'Messages')}
                </span>
                {navBarLink('/Subject', 'Subjects')}

                {token ? <div
                    className={'nav-bar-non-mobile-link text-red-600 hover:text-red-800 hover:cursor-pointer mx-1'}
                    onClick={e => dispatch(logout())}
                >SignOut</div> : navBarLink('/login', 'Login')}
            </div>
        </div>
    </nav>)
}

export default Navbar