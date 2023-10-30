import AppLink from "../Navigation/AppLink";
import {ReactNode} from "react";

export const GroupLink = ({to, children}: { to: string, children: ReactNode }) => {

    return (
        <AppLink
            to={to}
            className={'w-5/12 bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 rounded-xl h-12 flex justify-center items-center transition-all'}>
            {children}
        </AppLink>
    );
};