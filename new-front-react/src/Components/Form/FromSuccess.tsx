import {ReactNode} from "react";

const FromSuccess = ({children}: { children: ReactNode }) => {
    return (
        <h3>
            <p className={"text-center text-blue-600 text-2xl bg-blue-200 p-2"}>
                {children}
            </p>
        </h3>
    );
};

export default FromSuccess;