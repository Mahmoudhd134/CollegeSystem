import React, {ReactNode} from 'react';

const ProfileTitle = ({children}: { children: ReactNode }) => {
    return (
        <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4 flex justify-center items-center gap-7">
            {children}
        </h3>
    );
};

export default ProfileTitle;