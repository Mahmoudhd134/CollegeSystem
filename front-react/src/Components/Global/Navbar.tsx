import React, {useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import useAppSelector from "../../Hookes/useAppSelector";
import {logout} from "../../Feutures/Auth/authSlice";
import useAppDispatch from "../../Hookes/useAppDispatch";
import './Navbar.scss'
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLazyGetIsHasUnReadMessagesQuery} from "../../App/Api/MessageApi";

const Navbar = () => {
    const token = useAppSelector(s => s.auth.token)
    const dispatch = useAppDispatch()
    const isAdmin = useAppSelector(s => s.auth.roles)?.some(r => r.toLowerCase() == 'admin')
    const isDoctor = useAppSelector(s => s.auth.roles)?.some(r => r.toLowerCase() == 'doctor')
    const [send, {data: hasUnReadMessages}] = useLazyGetIsHasUnReadMessagesQuery()
    const loc = useLocation()

    useEffect(() => {
        if (token)
            send()
    }, [token])

    console.log(hasUnReadMessages)

    const styleImg = {
        width: "40px",
        height: '40px',
        borderRadius: '50%',
        display: 'inline',
        marginRight: '20px'
    };


    const redNotification = <div className={'rounded-circle position-absolute top-0 end-0'}
                                 style={{
                                     width: '25px',
                                     height: '25px',
                                     background: 'red',
                                     translate: '-50% 50%',
                                     opacity: '.7'
                                 }}
    ></div>

    return (
        <nav className="navbar navbar-expand-lg no-print">
            <div className="container-fluid">
                <Link to={'/'} className="navbar-brand">
                    <img src="/images/logo.png" alt="logo" style={{marginLeft: "20px"}} width={120}
                         height={100}/>
                </Link>
                <h5 className={'text d-none d-sm-block'}>Quality Management System
                    <p className={'text display-4'}>CS department</p>
                </h5>
                <button className="navbar-toggler border-white" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} className={'text-white'}/>
                    {hasUnReadMessages && redNotification}
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {/*{isAdmin && <li className="nav-item dropdown">*/}
                        {/*    <Link to={'/'} className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"*/}
                        {/*        aria-expanded="false">*/}
                        {/*        Admin Area*/}
                        {/*    </Link>*/}
                        {/*    <ul className="dropdown-menu">*/}
                        {/*        <li><Link to={'/doctor/list/0'} className="dropdown-item" ><img src="/images/doctor.png" style={styleImg} />Doctors</Link></li>*/}
                        {/*        <li><Link to={'/subject/list/0'} className="dropdown-item" > <img src="/images/material.png" style={styleImg} />Courses</Link></li>*/}
                        {/*        <li><Link to={'/message/inbox'} className="dropdown-item" > <img src="/images/gmail.png" style={{*/}
                        {/*            width: "38px",*/}
                        {/*            height: '38px',*/}
                        {/*            display: 'inline',*/}
                        {/*            marginRight: '20px'*/}
                        {/*        }} />Mails</Link></li>*/}
                        {/*    </ul>*/}
                        {/*</li>}*/}
                        {token == null ?
                            (<>
                                <li className="nav-item btn"
                                    onClick={e => dispatch(logout())}>
                                    <Link to={'/auth/login'} state={{from: loc}} className="btn m-4">Login <img
                                        src="/images/login.png"
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%'
                                        }}></img></Link>
                                </li>
                            </>) : (
                                <>
                                    {isAdmin ?
                                        <li className="nav-item dropdown">
                                            <div className="nav-link dropdown-toggle position-relative" role="button"
                                                 data-bs-toggle="dropdown"
                                                 aria-expanded="false"
                                                 style={{width: 'fit-content'}}
                                            >
                                                <FontAwesomeIcon icon={faBars}/>
                                                {hasUnReadMessages && redNotification}
                                            </div>
                                            <ul className="dropdown-menu">
                                                {isDoctor &&
                                                    <li><Link to={'/doctor/'} className="dropdown-item"><img
                                                        src="/images/doctor.png"
                                                        style={styleImg}/>Profile</Link></li>}
                                                <li><Link to={'/doctor/list/0'} className="dropdown-item"><img
                                                    src="/images/doctor.png"
                                                    style={styleImg}/>Doctors</Link></li>
                                                <li><Link to={'/subject/list/0'} className="dropdown-item"> <img
                                                    src="/images/material.png" style={styleImg}/>Courses</Link>
                                                </li>
                                                <li><Link to={'/message/inbox'}
                                                          className="dropdown-item position-relative"> <img
                                                    src="/images/mail.png"
                                                    style={{
                                                        width: "40px",
                                                        height: '40px',
                                                        display: 'inline',
                                                        marginRight: '20px'
                                                    }}/>
                                                    Mails{hasUnReadMessages && redNotification}
                                                </Link>
                                                </li>
                                                <li><Link to={'/subject/files/types'} className="dropdown-item">
                                                    <img src="/Images/fileTemplate.png" alt="" style={styleImg}/>
                                                    Templates</Link>
                                                </li>
                                                <li><Link to={'/auth/changePassword'} className="dropdown-item">
                                                    <img src="/Images/changePassword.png" alt="" style={styleImg}/>
                                                    Change Password</Link>
                                                </li>
                                                <li>
                                                    <div className="dropdown-item"
                                                         style={{cursor: 'pointer'}}
                                                         onClick={e => dispatch(logout())}>
                                                        <img src="/images/logout.png"
                                                             style={{
                                                                 width: "40px",
                                                                 height: '40px',
                                                                 display: 'inline',
                                                                 marginRight: '20px'
                                                             }}
                                                        />Logout
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                        :
                                        <li className="nav-item dropdown">
                                            <div className="nav-link dropdown-toggle position-relative" role="button"
                                                 data-bs-toggle="dropdown"
                                                 aria-expanded="false"
                                                 style={{width: 'fit-content'}}
                                            >
                                                <FontAwesomeIcon icon={faBars}/>
                                                {hasUnReadMessages && redNotification}
                                            </div>
                                            <ul className="dropdown-menu">
                                                <li><Link to={'/profile'} className="dropdown-item">
                                                    <img src="/images/profile.png"
                                                         style={styleImg}/> Profile</Link></li>
                                                <li><Link to={'/message/inbox'}
                                                          className="dropdown-item position-relative"> <img
                                                    src="/images/mail.png" style={styleImg}/>
                                                    Mails {hasUnReadMessages && redNotification}
                                                </Link>
                                                </li>
                                                <li>
                                                    <div className="dropdown-item"
                                                         style={{cursor: 'pointer'}}
                                                         onClick={e => dispatch(logout())}>
                                                        <img src="/images/logout.png"
                                                             style={styleImg}
                                                        />Logout
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                    }
                                </>)}
                        <div>
                            <img src="/images/colleg-logo.jpg"
                                 style={{marginLeft: "25px", borderRadius: '50%', padding: '5px'}} width={80}
                                 height={80}/>
                            <h5 className={'text'}>FCAI BSU</h5>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar