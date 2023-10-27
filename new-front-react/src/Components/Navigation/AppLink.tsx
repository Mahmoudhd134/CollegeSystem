import React, {ReactNode} from 'react';
import {Link, useLocation} from "react-router-dom";

type Props = {
    to: string,
    className?: string,
    children?: ReactNode
}
const AppLink = ({to, className, children}: Props) => {
    const loc = useLocation()
    return <Link to={to} state={{from: loc}} className={className}>{children}</Link>
};

export default AppLink;