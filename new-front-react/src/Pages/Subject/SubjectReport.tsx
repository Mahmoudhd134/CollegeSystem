import {useParams} from "react-router-dom";
import {useGetSubjectReportQuery} from "../../App/Api/SubjectApi";
import AppLink from "../../Components/Navigation/AppLink";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import TimeAgo from "../../Components/Global/TimeAgo";
import {MyButton} from "../../Components/Form/MyButton";

const SubjectReport = () => {
    const {code} = useParams()
    const {data: report, isFetching, isError, error} = useGetSubjectReportQuery(+code!)

    const maxFileTypes = Object.keys(SubjectFileTypes).map(Number).filter(isNaN).length
    const fileGroups = report && Array.from(Array(maxFileTypes).keys())
        .map(type => report.files.filter(f => f.type == type))

    let reportUi = <h3>Init Value</h3>
    if (isFetching)
        reportUi = <h3>Loading...</h3>

    if (isError && error)
        reportUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    reportUi = (!isError && !isFetching && report) ? <div className={'text-2xl sm:text-xl'}>
        <MyButton type={'button'} className={'no-print'} onClick={_ => window.print()}>Print</MyButton>
        <div className="p-4 bg-blue-50 rounded-lg shadow-md border border-gray-300">
            <div className="text-3xl font-bold text-indigo-700 mb-4">
                Subject Report - {report.name} ({report.code})
            </div>
            <div className="flex flex-wrap justify-between space-y-2">
                <div className="w-full md:w-1/2">
                    <p className="text-gray-600">Department: <b>{report.department.toUpperCase()}</b></p>
                    <p className="text-gray-600">Hours: <b>{report.hours}</b></p>
                    <p className="text-gray-600">Has a Doctor: <b>{report.hasADoctor ? 'Yes' : 'No'}</b></p>
                </div>
                <div className="w-full md:w-1/2">
                    <p className="text-gray-600">Is Complete: <b>{report.isComplete ? 'Yes' : 'No'}</b></p>
                    {report.hasADoctor && (
                        <p className="text-gray-600">Doctor: <b>{report.doctor.firstname} {report.doctor.lastname}</b>
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-indigo-700"><b>Doctor Information:</b></p>
                {report.hasADoctor ? (
                    <ul className="list-disc pl-6">
                        <li>Username: <b>{report.doctor.username}</b></li>
                        <li>Email: <b>{report.doctor.email}</b></li>
                        <li>Phone Number: <b>{report.doctor.phoneNumber}</b></li>
                        <li>National Number: <b>{report.doctor.nationalNumber}</b></li>
                        <li className={'no-print'}>More Info: <b><AppLink
                            to={'/Doctor/' + report.doctor.id}
                            className={'text-blue-900'}>
                            Click Here
                        </AppLink></b></li>
                    </ul>
                ) : (
                    <p className="text-gray-600">No doctor is assigned to this subject, if you thing that is wrong please contact the admin.</p>
                )}
            </div>
            <div className="mt-4">
                <p className="text-indigo-700">Attached Files:</p>
                {fileGroups?.map((group, i) => <div key={i}
                                                    className={'my-3 bg-blue-100 dark:bg-gray-100 p-3 rounded-2xl'}>
                    <h3 className="my-3 border-b-2 my-3">{SubjectFileTypes[i]}</h3>
                    <div className="flex flex-wrap justify-start gap-3">
                        {group.map(file => <div key={file.id}
                                                className={'border flex flex-col p-3 bg-blue-50 dark:bg-white rounded-xl'}>
                            <span>{file.name}</span>
                            <TimeAgo timestamp={file.date}/>
                        </div>)}
                    </div>
                </div>)}
            </div>
        </div>
    </div> : reportUi

    return <div className={'my-container min-h-remaining'}>
        {reportUi}
    </div>
}

export default SubjectReport