import {useParams} from "react-router-dom";
import {Option, Select, Spinner} from "@material-tailwind/react";
import {useGetSubjectWithMaterialsQuery} from "../../App/Api/SubjectApi";
import AppLink from "../../Components/Navigation/AppLink";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import {useAddSubjectMaterialMutation,} from "../../App/Api/SubjectMaterialApi";
import useAxiosApi from "../../Hookes/useAxiosApi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faUpload} from '@fortawesome/free-solid-svg-icons'
import React, {useRef, useState} from "react";
import {SubjectFiles} from "./SubjectFiles";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {BASE_URL} from "../../App/Api/axiosApi";
import useAppSelector from "../../Hookes/useAppSelector";

const SubjectWithFiles = () => {
    const {code} = useParams()
    const {data: subject, isFetching, isError, error} = useGetSubjectWithMaterialsQuery(+code!)
    const {searchParams, updateSearchParams} = useMySearchParams()
    const selectedFileTypeFilter = searchParams.get('type') ?? undefined
    const isCompleted = subject?.numberOfFileTypesUploaded == subject?.totalNumberOfFilesRequired
    const api = useAxiosApi()
    const dispatch = useAppDispatch()
    const upload = useAddSubjectMaterialMutation(dispatch, api, subject?.code ?? -1)
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [uploadFileState, setUploadFileState] = useState(false);
    const token = useAppSelector(s => s.auth.token)

    const filterValues = Object.values(SubjectFileTypes).filter(t => !isNaN(+t)) as number[]
    filterValues.unshift(-1)
    const filterObject = filterValues.map(fv => ({
        value: fv.toString(),
        text: fv == -1 ? 'All' : SubjectFileTypes[fv]
    }))
    const selectedFileTypeFilterNumber = +filterObject.filter(x => x.text === selectedFileTypeFilter)?.[0]?.value

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        if (!file)
            return
        const formDate = new FormData()
        formDate.append('file', file)
        formDate.append('type', selectedFileTypeFilterNumber?.toString())
        formDate.append('subjectId', subject?.id.toString() ?? '')
        setUploadFileState(true)
        upload(formDate)
            .finally(() => setUploadFileState(false))
    }

    let subjectUi = <h3>Init Value</h3>
    let filesUi = <h3>Init Value</h3>

    if (isFetching) {
        subjectUi = <h3>Loading...</h3>
        filesUi = <h3>Loading...</h3>
    }

    if (isError)
        subjectUi = filesUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    subjectUi = (subject && !isError && !isFetching) ? <div className={'flex flex-col gap-3'}>
        <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">
            {subject.name.split(' ').map(x => x[0].toUpperCase() + x.slice(1).toLowerCase() + ' ')}
        </h3>
        <div className={'bg-blue-300 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>
            <div>Department: {subject.department.toUpperCase()}</div>
            <div>Code: {subject.code}</div>
            <div>Hours: {subject.hours}</div>
            {subject.hasADoctor && <div>
                Doctor: <AppLink to={'/Doctor/' + subject.doctorId}
                                 className={'text-blue-900'}
            >Click Here</AppLink>
            </div>}
            <div
                className={`${isCompleted ? 'text-green-900' : 'text-red-500'}`}
            >Files Completed: ({subject.numberOfFileTypesUploaded}/{subject.totalNumberOfFilesRequired})
            </div>
        </div>
    </div> : subjectUi

    filesUi = (subject && !isError && !isFetching) ? <div className={'flex flex-col gap-3'}>
        <h3 className="bg-blue-500 text-center text-2xl sm:text-xl p-4">Files</h3>
        <div className={'bg-blue-300 p-4 text-xl sm:text-lg flex flex-col gap-3 tracking-wide w-11/12 mx-auto'}>

            <div className="flex gap-3 justify-around items-center flex-wrap">
                <div className="w-full sm:w-3/4 md:w-1/2">
                    <Select label={'Select Type'} color={'green'}
                            value={selectedFileTypeFilter}
                            onChange={e => updateSearchParams({type: e ?? '-1'})}>
                        {filterObject.map(f => <Option key={f.text} value={f.text}> {f.text} </Option>)}
                    </Select>
                </div>
                {(selectedFileTypeFilterNumber > -1) && <>
                    <div>
                        <a className={'hover:cursor-pointer text-blue-900'}
                           href={BASE_URL + `subjectFile/Template/${selectedFileTypeFilter}?token=${token}`}
                           target={'_blank'}
                        >
                            Download Template <FontAwesomeIcon icon={faDownload}/>
                        </a>
                    </div>

                    {subject.isOwner && (uploadFileState ? <Spinner color={'blue'}/> :
                        <div className={'hover:cursor-pointer text-blue-900'}
                             onClick={_ => inputFileRef.current?.click()}
                        >
                            <input type="file" ref={inputFileRef} onChange={handleFileInputChange} className="hidden"/>
                            <FontAwesomeIcon icon={faUpload}/>
                        </div>)}
                </>}
            </div>
            <SubjectFiles
                key={selectedFileTypeFilter}
                files={subject.files.filter(f =>
                    selectedFileTypeFilterNumber == -1 ? true : f.type == (selectedFileTypeFilterNumber ?? -1))}
                isOwner={subject.isOwner}
                subjectCode={subject.code}/>
        </div>
    </div> : filesUi

    return <div className={'my-container min-h-remaining'}>
        <div className="flex flex-col gap-3">
            {subjectUi}
            {filesUi}
        </div>
    </div>
};
export default SubjectWithFiles