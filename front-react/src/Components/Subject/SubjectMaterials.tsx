import {SubjectFileModel} from "../../Models/SubjectMaterial/SubjectFileModel";
import React, {useRef, useState} from "react";
import {
    downloadFile,
    useAddSubjectMaterialMutation,
    useDeleteSubjectMaterialMutation,
    useDownloadSubjectFileTypeTemplate
} from "../../App/Api/SubjectMaterialApi";
import {useNavigate} from "react-router-dom";
import useAppDispatch from "../../Hookes/useAppDispatch";
import useAppSelector from "../../Hookes/useAppSelector";
import SubjectMaterial from "./SubjectMaterial";
import useAxiosApi from "../../Hookes/useAxiosApi";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import {faUpload, faX} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert} from "react-bootstrap";

const SubjectMaterials = ({
                              materials,
                              isOwner,
                              id,
                              code
                          }: { materials: SubjectFileModel[], isOwner: boolean, id: number, code: number }) => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(s => s.auth.token)
    const api = useAxiosApi()
    const navigator = useNavigate()
    const add = useAddSubjectMaterialMutation(dispatch, api)
    const file = useRef() as React.MutableRefObject<HTMLInputElement>
    const [idToRemove, setIdToRemove] = useState<number | null>(null)
    const [remove, removeResult] = useDeleteSubjectMaterialMutation()
    const [fileType, setFileType] = useState<SubjectFileTypes>(-1)
    const [showUpload, setShowUpload] = useState(false)
    const [addError, setAddError] = useState('')
    const [filter, setFilter] = useState(-1)
    const downloadTemplate = useDownloadSubjectFileTypeTemplate(api)
    const [err, setErr] = useState('')

    const addMaterialHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const f = file.current.files![0]
        if (f == undefined)
            return
        const data = new FormData()
        data.append('subjectId', id.toString())
        data.append('file', f)
        data.append('Type', fileType.toString())
        try {
            await add(data)
            setAddError('')
        } catch (error) {
            //@ts-ignore
            setAddError(error?.response?.data?.message ?? 'Unknown error')
        }
        setShowUpload(false)
        setFileType(-1)
        navigator('/subject/' + code)
    }

    const downloadTypeTemplate = (type: keyof typeof SubjectFileTypes) => () =>
        downloadTemplate(type)
            .then(({data}) => {
                downloadFile(data, `${type}-template.docx`)
                setErr('')
            })
            .catch(e => //@ts-ignore
                setErr('Failed to download template of type ' + m.name + '\n' + e?.response?.data?.message ?? '')
            )


    const handleXClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowUpload(false)
        setFileType(-1)
    }

    const removeHandlerOne = (id: number) => {
        return (e: React.MouseEvent) => {
            e.preventDefault()
            setIdToRemove(id)
        }
    }

    const removeHandlerTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        remove({id: idToRemove!, subjectId: id})
        setIdToRemove(null)
    }

    const returnBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIdToRemove(null)
    }

    const selectTypeForUploadFile = () => {
        const keys = Object.keys(SubjectFileTypes).filter(t => isNaN(Number(t)))
        return <div className="btn-group">
            <button type="button" className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                {fileType.valueOf() == -1 ? 'Choose a Type' : SubjectFileTypes[fileType]}
            </button>
            <ul className="dropdown-menu">
                {keys.map(k => <li key={k}
                                   onClick={e => setFileType(SubjectFileTypes[k as keyof typeof SubjectFileTypes])}>
                    <div className="dropdown-item">{k}</div>
                </li>)}
            </ul>
        </div>
    }
    const selectTypeForFiltering = (className?: string) => {
        const keys = Object.keys(SubjectFileTypes).filter(t => isNaN(Number(t)))
        return <div className={"btn-group " + className ?? ''}>
            <button type="button" className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                {filter == -1 ? 'All' : SubjectFileTypes[filter]}
            </button>
            <ul className="dropdown-menu">
                <li onClick={e => setFilter(-1)}>
                    <div className="dropdown-item">All</div>
                </li>
                {keys.map(k => <li key={k}
                                   onClick={e => setFilter(SubjectFileTypes[k as keyof typeof SubjectFileTypes])}>
                    <div className="dropdown-item">{k}</div>
                </li>)}
            </ul>
        </div>
    }

    return (
        <div style={{backgroundColor: '#eee'}}>
            <h3 className={'text-center'}>Materials</h3>
            {err.length > 0 && <Alert variant={'danger'}>{err}</Alert>}
            {idToRemove && <div
                className='border border-3 rounded rounded-3 mx-auto p-3 bg-white' style={{width: '90%'}}>
                <h3 className='text-center'>Are You Sure You Want To
                    Delete {materials?.filter(d => d.id == idToRemove)[0].name}</h3>
                <div className="row justify-content-center gap-4">
                    <div className="col-4">
                        <button onClick={removeHandlerTwo} className='btn btn-outline-danger'>Remove Any Way</button>
                    </div>

                    <div className="col-4">
                        <button onClick={returnBack} className='btn btn-outline-primary'>Return Back</button>
                    </div>
                </div>
            </div>}
            {isOwner &&
                <div className="row">
                    {addError.length > 0 &&
                        <div className={'col-12 text-center text-danger d-flex justify-content-center'}>
                            <h3 className={'w-75'}> {addError} </h3>
                        </div>}
                    <div className="col-md-12 text-center mt-3">
                        <input type={'file'}
                               ref={file}
                               style={{display: 'none'}}
                               onChange={addMaterialHandler}
                        />

                        {!showUpload && <button className={'btn btn-primary'}
                                                onClick={e => setShowUpload(true)}
                        >Add Material </button>}

                        {showUpload && <div className={'d-flex flex-wrap gap-3 justify-content-center'}>
                            {selectTypeForUploadFile()}
                            <button className="btn btn-outline-primary"
                                    disabled={fileType.valueOf() == -1}
                                    onClick={downloadTypeTemplate(SubjectFileTypes[fileType] as keyof typeof SubjectFileTypes)}>
                                Template
                            </button>
                            <button className="btn btn-outline-primary"
                                    disabled={fileType.valueOf() == -1}
                                    onClick={e => file.current.click()}>
                                <FontAwesomeIcon icon={faUpload}/>
                            </button>
                            <button className={'btn btn-outline-danger'}
                                    onClick={handleXClick}
                            ><FontAwesomeIcon icon={faX}/></button>
                        </div>}

                    </div>
                </div>
            }

            <div className="container">
                <div className="row justify-content-center">
                    {selectTypeForFiltering('col-12 col-sm-8 col-md-6 col-lg-3')}
                </div>
                <div className="row justify-content-around">
                    {materials?.filter(m => filter == -1 ? true : m.type == filter)
                        .map(m => <SubjectMaterial key={m.id}
                                                   material={m}
                                                   isOwner={isOwner}
                                                   removeHandler={removeHandlerOne(m.id)}
                                                   api={api}
                                                   token={token}/>)}

                </div>
            </div>
        </div>
    );
};

export default SubjectMaterials;