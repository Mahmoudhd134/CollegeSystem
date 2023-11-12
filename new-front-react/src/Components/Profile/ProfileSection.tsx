import {ReactNode} from "react";

const ProfileSection = ({children}: { children: ReactNode }) => {
    return (
        <div className={'bg-blue-400 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
            {children}
        </div>
    );
};

export default ProfileSection;