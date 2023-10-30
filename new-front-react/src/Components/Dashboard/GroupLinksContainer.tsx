import React from 'react';

const GroupLinksContainer = ({children}:any) => {
    return (
        <div className="flex justify-between mt-3">
            {children}
        </div>
    );
};

export default GroupLinksContainer;