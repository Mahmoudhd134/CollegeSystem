import {Link, Outlet} from "react-router-dom";
import useGetRoute from "../../Hookes/useGetRoute";
import './Auth.scss'

const AuthLayout = () => {
    const page = useGetRoute()

    return (
        <div
            className={`container d-flex justify-content-center`} style={{padding: '20px'}}>
            <div className="card"
                 style={{width: 'fit-content'}}
            >
                <div className={'card-header'}>
                    <ul className="nav nav-tabs card-header-tabs d-flex justify-content-center">
                        <li className="nav-item">
                            <Link to={'/auth/login'} className={`nav-link ${page == 'login' ? 'active' : ''}`}
                                  aria-current="true">Login</Link>
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*    <Link to={'/auth/reg'} className={`nav-link ${page == 'reg' ? 'active' : ''}`}>Signup</Link>*/}
                        {/*</li>*/}
                    </ul>
                </div>

                <div className={'card-body d-flex justify-content-center'}>
                    <Outlet/>
                </div>
            </div>
        </div>)
};

export default AuthLayout;