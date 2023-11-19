import useIsInRole from "../../Hookes/useIsInRole";
import MyButtonAsLink from "../../Components/Form/MyButtonAsLink";
import {Outlet} from "react-router-dom";
import useGetRoute from "../../Hookes/useGetRoute";

const MailsLayout = () => {
    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')

    const route = useGetRoute()
    const active = ' bg-blue-700'

    return <div className={'my-container min-h-remaining'}>
        <div className="flex justify-around my-3 mb-5">
            <MyButtonAsLink to={'/Mail/Inbox'}
                            className={'min-w-[8rem] text-center' + (route.toLowerCase() == 'received' ? active : '')}>
                Inbox
            </MyButtonAsLink>

            {isAdmin && <MyButtonAsLink to={'/Mail/Sent'}
                                        className={'min-w-[8rem] text-center' + (route.toLowerCase() == 'sent' ? active : '')}>
                Sent
            </MyButtonAsLink>}
        </div>

        <Outlet/>
    </div>
};
export default MailsLayout