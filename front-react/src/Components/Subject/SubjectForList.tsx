import React from 'react';
import './SubjectForList.css'
import {SubjectForPageModel} from "../../Models/Subject/SubjectForPageModel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTrash, faX} from "@fortawesome/free-solid-svg-icons";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";

interface Props {
    subject: SubjectForPageModel,
    onClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void,
    onDelete: (e: React.MouseEvent) => void
}

const SubjectForList = ({subject: s, onClickHandler, onDelete}: Props) => {
    const isComplete = s.numberOfFilesTypes == Object.keys(SubjectFileTypes).length / 2
    return (
        <div
            className={'col-sm-5 col-lg-3 d-flex flex-column align-items-center border text-center border-3 rounded-3 subject'}
            onClick={onClickHandler}
        >
            <h3>{s.name}</h3>
            <h3 className={'mt-1'}>{s.department}</h3>
            <p>#{s.code}</p>
            <h5 className={'mt-1'}><b>{s.numberOfFilesTypes}</b> File Type Upload</h5>
            {isComplete && <h5 className={'text-primary'}><FontAwesomeIcon icon={faCheck}/> Completed</h5>}
            {!isComplete && <h5 className={'text-danger'}><FontAwesomeIcon icon={faX}/> Not Completed</h5>}
            <div className={'remove-subject'}
                 onClick={onDelete}
            >
                <FontAwesomeIcon icon={faTrash} className={'remove-subject-icon'}/>
            </div>
        </div>
    );
};

export default SubjectForList;