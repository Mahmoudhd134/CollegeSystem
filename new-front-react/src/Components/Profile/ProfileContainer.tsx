import {ReactNode} from "react";

const ProfileContainer = ({children}: { children: ReactNode }) => {
    return (
        <div className={'flex flex-col gap-3'}>
            {children}
        </div>
    );
};

export default ProfileContainer;