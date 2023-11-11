import React, {ReactNode} from "react";
import AppLink from "../Navigation/AppLink";

type Props = {
    to: string
    children: ReactNode,
    className?: string,
}
const MyButtonAsLink = ({to, children, className}: Props) => {

    return <AppLink
        to={to}
        className={'bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 border border-blue-600 rounded-2xl p-3 transition-all hover:shadow-xl hover:shadow-blue-200 ' + className}
    >
        {children}
    </AppLink>
};

export default MyButtonAsLink;