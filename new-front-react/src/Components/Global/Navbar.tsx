import useAppSelector from "../../Hookes/useAppSelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faEnvelope, faHand, faX} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {logout, resetAuthState} from "../../App/Feutures/Auth/authSlice";
import './navbar.css'
import AppLink from "../Navigation/AppLink";
import {baseApi} from "../../App/Api/BaseApi";
import {useLazyGetIsHasUnReadMailsQuery} from "../../App/Api/MailApi";
import {resetRoomState} from "../../App/Feutures/Room/roomSlice";
import {resetAppState} from "../../App/Feutures/App/AppSlice";
import {Avatar, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography} from "@material-tailwind/react";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import TimeAgo from "./TimeAgo";
import useIsInRole from "../../Hookes/useIsInRole";

const Navbar = () => {
    const {token, profileImage} = useAppSelector(s => s.auth)
    const username = useAppSelector(s => s.auth.username)
    const [showMobMenu, setShowMobMenu] = useState(false)
    const dispatch = useAppDispatch()
    const [getHasUnReadMails, {data: hasUnReadMails}] = useLazyGetIsHasUnReadMailsQuery()
    const {messageNotifications, delayedSubjectMessage} = useAppSelector(s => s.app)
    const isInRole = useIsInRole()

    const hasUnReadMessages = (messageNotifications.length > 0) || (delayedSubjectMessage.length > 0)

    const isAdmin = isInRole('admin')
    const isDoctor = isInRole('doctor')
    const isStudent = isInRole('student')

    useEffect(() => {
        getHasUnReadMails()
    }, [token])

    const redNotifyIconClasses = 'absolute top-1/2 right-0 -translate-y-1/2 opacity-75 w-4 h-4 rounded-full bg-red-900 dark:bg-red-900'
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
        {isAdmin && mobLink('/AdminDashboard', username ?? 'Admin Dashboard')}
        {isDoctor && mobLink('/Doctor/me', username ?? 'Profile')}
        {isStudent && mobLink('/Student/me', username ?? 'Profile')}
        {(isAdmin || isDoctor) && <span className={'relative'}>
            <span className={redNotifyIconClasses}></span>
            {mobLink('/Mail/Inbox', 'Inbox')}
        </span>}
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

    const clockIcon = <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99998 14.9C9.69736 14.9 11.3252 14.2257 12.5255 13.0255C13.7257 11.8252 14.4 10.1974 14.4 8.49998C14.4 6.80259 13.7257 5.17472 12.5255 3.97449C11.3252 2.77426 9.69736 2.09998 7.99998 2.09998C6.30259 2.09998 4.67472 2.77426 3.47449 3.97449C2.27426 5.17472 1.59998 6.80259 1.59998 8.49998C1.59998 10.1974 2.27426 11.8252 3.47449 13.0255C4.67472 14.2257 6.30259 14.9 7.99998 14.9ZM8.79998 5.29998C8.79998 5.0878 8.71569 4.88432 8.56566 4.73429C8.41563 4.58426 8.21215 4.49998 7.99998 4.49998C7.7878 4.49998 7.58432 4.58426 7.43429 4.73429C7.28426 4.88432 7.19998 5.0878 7.19998 5.29998V8.49998C7.20002 8.71213 7.28434 8.91558 7.43438 9.06558L9.69678 11.3288C9.7711 11.4031 9.85934 11.4621 9.95646 11.5023C10.0536 11.5425 10.1577 11.5632 10.2628 11.5632C10.3679 11.5632 10.472 11.5425 10.5691 11.5023C10.6662 11.4621 10.7544 11.4031 10.8288 11.3288C10.9031 11.2544 10.9621 11.1662 11.0023 11.0691C11.0425 10.972 11.0632 10.8679 11.0632 10.7628C11.0632 10.6577 11.0425 10.5536 11.0023 10.4565C10.9621 10.3593 10.9031 10.2711 10.8288 10.1968L8.79998 8.16878V5.29998Z"
            fill="#90A4AE"
        />
    </svg>

    return (<nav className={'nav-bar no-print'}>
        <div className="container mx-auto p-4 flex items-center justify-between">
            <AppLink to={'/'}
                     className={'text-3xl sm:text-2xl hover:text-blue-700 transition-all'}>Home</AppLink>

            {showMobMenu ? mobMenu : mobMenuButton}

            <div>
                {token ? <Menu>
                    <MenuHandler>
                        <Avatar
                            variant="circular"
                            alt="tania andrew"
                            className="cursor-pointer"
                            src={PROFILE_IMAGES_URL + profileImage}
                        />
                    </MenuHandler>
                    <MenuList>
                        <MenuItem className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faHand}/>

                            <Typography variant="small" className="font-medium">
                                Hi: {username}
                            </Typography>
                        </MenuItem>

                        <AppLink to={isAdmin ? '/AdminDashboard' :
                            isDoctor ? '/Doctor/Me' :
                                isStudent ? '/Student/Me' :
                                    '/'}>
                            
                            <MenuItem className="flex items-center gap-2 relative">
                                {hasUnReadMessages && <span className={redNotifyIconClasses}></span>}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                                        fill="#90A4AE"
                                    />
                                </svg>

                                <Typography variant="small" className="font-medium">
                                    My Profile
                                </Typography>
                            </MenuItem>
                        </AppLink>

                        {(isAdmin || isDoctor) &&
                            <AppLink to={'/Mail/Inbox'}>
                                <MenuItem className="flex items-center gap-2 relative">
                                    {hasUnReadMails && <span className={redNotifyIconClasses}></span>}

                                    <FontAwesomeIcon icon={faEnvelope}/>
                                    <Typography variant="small" className="font-medium">
                                        Inbox
                                    </Typography>
                                </MenuItem>
                            </AppLink>}

                        <hr className="my-2 border-blue-gray-50"/>

                        <MenuItem className="flex items-center gap-2 ">
                            <svg
                                width="16"
                                height="14"
                                viewBox="0 0 16 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                                    fill="#90A4AE"
                                />
                            </svg>
                            <Typography variant="small" className="font-medium">
                                <div
                                    className={'nav-bar-non-mobile-link text-red-600 hover:text-red-800 hover:cursor-pointer mx-1'}
                                    onClick={e => {
                                        dispatch(logout())
                                        dispatch(baseApi.util.resetApiState())
                                        dispatch(resetAuthState())
                                        dispatch(resetRoomState())
                                        dispatch(resetAppState())
                                    }}
                                >SignOut
                                </div>
                            </Typography>
                        </MenuItem>
                    </MenuList>
                </Menu> : navBarLink('/login', 'Login')}

                {messageNotifications.length > 0 && <Menu>
                    <MenuHandler>
                        <IconButton variant="text">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </IconButton>
                    </MenuHandler>
                    <MenuList className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll">
                        {messageNotifications.slice(0, 3).map((n, i) => <AppLink key={i} to={'/Room/' + n.roomId}>
                            <MenuItem key={i}
                                      className="flex items-center gap-4 py-2 pl-2 pr-8">
                                <div className="flex flex-col gap-1">
                                    <Avatar
                                        variant="circular"
                                        alt="tania andrew"
                                        src={PROFILE_IMAGES_URL + n.sender.image}
                                    />
                                    <Typography variant="small" color="gray" className="font-semibold">
                                        subject: {n.subjectName}
                                        <br/>
                                        room: {n.roomName}
                                        <br/>
                                        sender: {n.sender.userName}
                                    </Typography>

                                    <Typography>
                                        {n.first100Char}
                                    </Typography>

                                    <Typography
                                        className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
                                        {clockIcon}
                                        <TimeAgo timestamp={n.date as unknown as string}/>
                                    </Typography>
                                </div>
                            </MenuItem>
                        </AppLink>)}

                        <hr/>

                        {<AppLink to={'/Notifications'} className={'text-center'}>
                            <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
                                <div className="flex flex-col gap-1">
                                    <Typography variant="small" color="gray" className="font-semibold text-center">
                                        More...
                                    </Typography>
                                </div>
                            </MenuItem>
                        </AppLink>}
                    </MenuList>
                </Menu>}
            </div>
        </div>
    </nav>)
}

export default Navbar