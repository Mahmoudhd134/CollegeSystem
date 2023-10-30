import React from 'react';

const GroupsContainer = ({children}:any) => {
    return (
        <div className="flex flex-wrap justify-evenly gap-2">
            {children}
        </div>
    );
};

export default GroupsContainer;