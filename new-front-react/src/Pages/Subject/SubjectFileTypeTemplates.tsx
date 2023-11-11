import {useRef, useState} from "react";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faUpload} from "@fortawesome/free-solid-svg-icons";
import {BASE_URL} from "../../App/Api/axiosApi";
import useAppSelector from "../../Hookes/useAppSelector";
import {useUploadSubjectFileTypeTemplate} from "../../App/Api/SubjectMaterialApi";
import useAxiosApi from "../../Hookes/useAxiosApi";
import {Spinner} from "@material-tailwind/react";

const SubjectFileTypeTemplates = () => {
    const templateRefs = useRef<HTMLInputElement[]>([])
    const templates = Object.keys(SubjectFileTypes).filter(x => isNaN(+x))
    const token = useAppSelector(s => s.auth.token)
    const api = useAxiosApi()
    const upload = useUploadSubjectFileTypeTemplate(api)
    const [uploadingIndex, setUploadingIndex] = useState(-1)

    const handleFileUpload = (type: SubjectFileTypes, index: number) => async () => {
        const file = templateRefs.current[index]?.files?.item(0)
        if (!file)
            return
        setUploadingIndex(index)
        const data = new FormData()
        data.append('file', file)
        data.append('type', type.toString())
        await upload(data)
        setUploadingIndex(-1)
    }

    return <div className={'my-container'}>
        <div className="flex flex-col gap-3">
            {templates.map((x, i) => <div key={x} className={'border-2 rounded-xl p-3'}>
                <h3 className="text-2xl sm:text-xl text-center">{x}</h3>
                <div className="flex justify-around my-3">
                    <a href={BASE_URL + 'subjectFile/Template/' + x + '?token=' + token}>
                        <FontAwesomeIcon icon={faDownload}/>
                    </a>

                    {uploadingIndex == i ?
                        <Spinner/> :
                        uploadingIndex != -1 ?
                            <FontAwesomeIcon icon={faUpload}/> :
                            <FontAwesomeIcon className={'hover:cursor-pointer'}
                                             onClick={_ => templateRefs.current[i]?.click()}
                                             icon={faUpload}/>}
                </div>
                <input type="file" onChange={handleFileUpload(SubjectFileTypes[x as keyof typeof SubjectFileTypes], i)}
                       className={'hidden'}
                       ref={r => templateRefs.current[i] = r!}/>
            </div>)}
        </div>
    </div>
};

export default SubjectFileTypeTemplates;