import {
    downloadFile,
    useDownloadSubjectFileTypeTemplate,
    useUploadSubjectFileTypeTemplate
} from "../../App/Api/SubjectMaterialApi";
import UseAxiosApi from "../../Hookes/useAxiosApi";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faUpload} from "@fortawesome/free-solid-svg-icons";
import {Alert} from "react-bootstrap";

const SubjectFileTypesPage = () => {
    const api = UseAxiosApi()
    const download = useDownloadSubjectFileTypeTemplate(api)
    const upload = useUploadSubjectFileTypeTemplate(api)
    const files = useRef([]) as React.MutableRefObject<HTMLInputElement[]>
    const [err, setErr] = useState('')

    const types = Object.keys(SubjectFileTypes).filter(t => isNaN(Number(t)))

    useEffect(() => {
        files.current = files.current.slice(0, types.length)
    }, [])

    const downloadTypeTemplate = (type: keyof typeof SubjectFileTypes) => async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
            const {data} = await download(type)
            downloadFile(data, type + '-template.docx')
        } catch (e) {
            //@ts-ignore
            setErr('Failed to download template of type ' + type + '\n' + e?.response?.data?.message ?? '')
        }
    }
    const uploadFileTypeTemplate = (type: keyof typeof SubjectFileTypes, index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = files.current[index].files?.item(0)!
        const formDate = new FormData()
        formDate.append('file', file)
        formDate.append('type', type)
        try {
            await upload(formDate)
            setErr('')
        } catch (e) {
            //@ts-ignore
            setErr('Failed to upload template of type ' + type + '\n' + e?.response?.data?.message ?? '')
        }
    }

    return (
        <main>
            <div className="container py-2">
                {err.length > 0 && <Alert className='text-center' variant={'danger'}>{err}</Alert>}
                <div className="row justify-content-center">
                    {types.map((t, i) => <div key={t}
                                              className={'border border-3 rounded-3 p-3 text-center col-12 col-sm-10 col-md-8 col-lg-7 my-3'}>
                        <div>Type : <b>{t}</b></div>
                        <div className={'d-flex gap-5 justify-content-around p-3'}>
                            <div onClick={downloadTypeTemplate(t as keyof typeof SubjectFileTypes)}>
                                <FontAwesomeIcon icon={faDownload} className={'btn btn-outline-primary'}/>
                            </div>
                            <div>
                                <input type="file" ref={el => files.current[i] = el!} className={'d-none'}
                                       onInput={uploadFileTypeTemplate(t as keyof typeof SubjectFileTypes, i)}
                                />
                                <span onClick={e => files.current[i].click()}> 
                                    <FontAwesomeIcon icon={faUpload} className={'btn btn-outline-primary'}/>
                                </span>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </main>
    );
};

export default SubjectFileTypesPage;