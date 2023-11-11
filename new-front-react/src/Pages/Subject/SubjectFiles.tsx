import {SubjectFileModel} from "../../App/Models/SubjectMaterial/SubjectFileModel";
import TimeAgo from "../../Components/Global/TimeAgo";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import {faDownload, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MyButton} from "../../Components/Form/MyButton";
import {useDeleteSubjectMaterialMutation,} from "../../App/Api/SubjectMaterialApi";
import {useMemo, useState} from "react";
import {Spinner} from "@material-tailwind/react";
import useAppSelector from "../../Hookes/useAppSelector";
import {BASE_URL} from "../../App/Api/axiosApi";

type Props = {
    files: SubjectFileModel[],
    isOwner: boolean,
    subjectCode: number
}
export const SubjectFiles = ({files, isOwner, subjectCode}: Props) => {
    const downloadButtonClasses = 'bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 border border-blue-600 rounded-2xl p-3 transition-all hover:shadow-xl hover:shadow-blue-200 w-8/12 sm:w-5/12 hover:cursor-pointer bg-blue-500 text-blue-900 flex justify-center p-3 rounded-xl'
    const removeButtonClasses = 'w-8/12 sm:w-5/12 hover:cursor-pointer bg-red-500 text-red-900 hover:bg-red-600 flex justify-center p-3 rounded-xl'
    const [remove] = useDeleteSubjectMaterialMutation()
    const [fileDeleting, setFileDeleting] = useState<number | undefined>(undefined);
    const token = useAppSelector(s => s.auth.token)
    const errors = useMemo(() => new Map<number, string>(), []);

    return <div className={'flex-sm1-md2-lg3-gap-3 justify-around'}>
        {files.map(x => <div key={x.id} className="border rounded-xl p-3 flex flex-col items-center">
            {errors.has(x.id) && <h3 className="w-full bg-red-300 text-red-900 text-center text-wrap">
                {errors.get(x.id)?.split('\n').map((e, i) => <p key={i}>{e}</p>)}
            </h3>}
            <div>{x.name}</div>
            <div>{SubjectFileTypes[x.type]}</div>
            <TimeAgo timestamp={x.date}/>
            <div className="flex flex-wrap gap-1 w-full items-center justify-center">
                <a className={downloadButtonClasses}
                   target={'_blank'}
                   href={BASE_URL + 'subjectFile/' + x.storedName + `?token=${token}&returnName=${x.name}`}>
                    <FontAwesomeIcon icon={faDownload}/>
                </a>
                {isOwner && (fileDeleting == x.id ? <Spinner color={'blue'}/> :
                    <MyButton type={'button'} className={removeButtonClasses}
                              onClick={_ => {
                                  setFileDeleting(x.id)
                                  remove({id: x.id, subjectCode})
                                      //@ts-ignore
                                      .then(r => r?.error && errors.set(x.id, ((errors.get(x.id) ?? '' + '\n').trim() + '\nerror deleting the file => ' + r?.error?.data.message).trim()))
                                      .finally(() => setFileDeleting(undefined))
                              }}
                    >
                        <FontAwesomeIcon icon={faTrash}/></MyButton>)}
            </div>
        </div>)}
    </div>

};