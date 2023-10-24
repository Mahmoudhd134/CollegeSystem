import React, {useState} from 'react';
import TimeAgo from "../Global/TimeAgo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faTrash} from "@fortawesome/free-solid-svg-icons";
import {SubjectFileModel} from "../../Models/SubjectMaterial/SubjectFileModel";
import useAxiosApi from "../../Hookes/useAxiosApi";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import {downloadFile, useDownloadSubjectMaterial} from "../../App/Api/SubjectMaterialApi";
import {Alert} from "react-bootstrap";

interface Props {
    material: SubjectFileModel,
    isOwner: boolean,
    removeHandler: (e: React.MouseEvent) => void,
    api: ReturnType<typeof useAxiosApi>,
    token: string | null,

}

const SubjectMaterial = ({material: m, isOwner, removeHandler, api}: Props) => {
    const download = useDownloadSubjectMaterial(api)
    const [err, setErr] = useState('')
    const handleDownload = () =>
        download(m.storedName)
            .then(({data}) => {
                downloadFile(data, m.name)
                setErr('')
            })
            .catch(e => {
                    //@ts-ignore
                    setErr('Failed to download  ' + m.name + '\n' + e?.response?.data?.message ?? '')
                }
            )


    return (
        <div
            className="col-12 col-md-5 col-lg-3 bg-white border border-3 rounded rounded-3 d-flex flex-column
            align-items-center mx-1 my-1 card">
            {err.length > 0 && <Alert variant={'danger'}>{err}</Alert>}
            <h5 className={'my-1 card-title'}>{m.name}</h5>
            <p className={'mt-auto'}><TimeAgo timestamp={m.date}/></p>
            <p className={'mt-auto'}>{SubjectFileTypes[m.type]}</p>
            <div className="row my-1 card-footer w-100 justify-content-center">
                {isOwner ? <>
                        <div className="col-6 text-center">
                            <FontAwesomeIcon className={'btn btn-outline-danger w-75'}
                                             onClick={removeHandler}
                                             icon={faTrash}/>
                        </div>
                        <div className="col-6 text-center" onClick={handleDownload}>
                            <FontAwesomeIcon className={'btn btn-outline-primary w-75'} icon={faDownload}/>
                        </div>
                    </> :
                    <div className="col-12 btn btn-outline-primary w-100" onClick={handleDownload}>
                        <FontAwesomeIcon className={'btn btn-outline-primary w-75'} icon={faDownload}/>
                    </div>
                }
            </div>
        </div>
    );
};

export default SubjectMaterial;