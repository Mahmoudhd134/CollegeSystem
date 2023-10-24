import {Link, Outlet, useLocation} from "react-router-dom";
import useAppSelector from "../../Hookes/useAppSelector";

const MessageLayout = () => {
    const pathNames = useLocation().pathname.split('/')
    const lastPath = pathNames[pathNames.length - 1]
    const isAdmin = useAppSelector(s => s.auth.roles)?.some(r => r.toLowerCase() == 'admin')
    return (
        <main className={'my-3'}>
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-md-3">
                        <div className="list-group">
                            <Link to={'/message/inbox'}
                                  className={`list-group-item ${lastPath == 'inbox' && 'active'}`}><i
                                className="fa fa-download me-2"></i>Inbox</Link>
                            {isAdmin && <Link to={'/message/sent'}
                                              className={`list-group-item ${lastPath == 'sent' && 'active'}`}>
                                <i className="fa fa-star-o me-2"></i>Sent</Link>}
                        </div>
                    </div>
                    <div className="col-md-9" style={{overflowX: 'scroll'}}>
                        <Outlet/>
                    </div>
                </div>
            </div>
        </main>);
};

export default MessageLayout;