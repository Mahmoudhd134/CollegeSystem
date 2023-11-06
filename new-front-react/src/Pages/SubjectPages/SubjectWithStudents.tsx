import {useParams} from "react-router-dom";
import {useGetSubjectWithStudentsQuery} from "../../App/Api/SubjectApi";

const SubjectWithStudents = () => {
    const {code} = useParams()
    const {data: subject} = useGetSubjectWithStudentsQuery(+code!)
    return <h3>
        <pre>{JSON.stringify(subject, null, 4)}</pre>
    </h3>
};
export default SubjectWithStudents