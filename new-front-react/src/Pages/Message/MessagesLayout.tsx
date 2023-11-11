import useIsInRole from "../../Hookes/useIsInRole";
import MyButtonAsLink from "../../Components/Form/MyButtonAsLink";
import {Outlet} from "react-router-dom";
import useGetRoute from "../../Hookes/useGetRoute";

const MessagesLayout = () => {
    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')

    const route = useGetRoute()
    const active = ' bg-blue-700'

    return <div className={'my-container min-h-remaining'}>
        <div className="flex justify-around my-3 mb-5">
            <MyButtonAsLink to={'/Message/Received'}
                            className={'min-w-[8rem] text-center' + (route.toLowerCase() == 'received' ? active : '')}>
                Received
            </MyButtonAsLink>

            {isAdmin && <MyButtonAsLink to={'/Message/Sent'}
                                        className={'min-w-[8rem] text-center' + (route.toLowerCase() == 'sent' ? active : '')}>
                Sent
            </MyButtonAsLink>}
        </div>

        <Outlet/>
    </div>
};
export default MessagesLayout