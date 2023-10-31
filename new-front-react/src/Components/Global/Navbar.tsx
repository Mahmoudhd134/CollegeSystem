import {Link, useLocation} from "react-router-dom";
import useAppSelector from "../../Hookes/useAppSelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faX} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {logout} from "../../Feutures/Auth/authSlice";
import './navbar.css'

const Navbar = () => {
    const loc = useLocation()
    const token = useAppSelector(s => s.auth.token)
    const [showMobMenu, setShowMobMenu] = useState(false)
    const dispatch = useAppDispatch()

    const isInRole = ((roles: string[] | null) => (role: string) =>
        roles?.some(x => x.toLowerCase() === role.toLowerCase()))(useAppSelector(s => s.auth.roles))

    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')
    const mobLink = (link: string, text: string) =>
        <Link to={link} state={{from: loc}} className='nav-bar-mobile-link'>{text}</Link>
    const navBarLink = (link: string, text: string) =>
        <Link to={link} state={{from: loc}} className='nav-bar-non-mobile-link'>{text}</Link>

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
            <Link to={'/'} state={{from: loc}}
                  className={'text-3xl sm:text-2xl hover:text-blue-700 transition-all'}>Home</Link>

            {showMobMenu ? mobMenu : mobMenuButton}

            <div className="hidden sm:flex ml-auto gap-3">
                {/*Non-Mob Links */}
                {isAdmin && navBarLink('/AdminDashboard', 'AdminDashboard')}

                {isDoctor && navBarLink('/doctor/me', 'Profile')}
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