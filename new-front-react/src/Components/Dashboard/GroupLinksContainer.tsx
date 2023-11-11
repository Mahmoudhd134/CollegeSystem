import React, {useRef} from 'react';
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";

const GroupLinksContainer = ({children}: any) => {
    return (
        <div className="flex flex-wrap justify-center gap-5 mt-3">
            {children}
        </div>
    );
};

export default GroupLinksContainer;