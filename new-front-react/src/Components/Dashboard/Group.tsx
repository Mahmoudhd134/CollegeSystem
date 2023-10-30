import React from 'react';

const Group = ({children}:any) => {
    return (
        <div
            className="border border-blue-700 p-5 w-full sm:w-5/12 rounded-xl bg-blue-200 hover:shadow hover:shadow-blue-200">
            {children}
        </div>
    );
};

export default Group;