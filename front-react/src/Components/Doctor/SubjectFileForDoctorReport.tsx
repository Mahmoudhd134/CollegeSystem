import {SubjectForDoctorReportModel} from "../../Models/Doctor/SubjectForDoctorReportModel";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";

const SubjectFileForDoctorReport = ({subject}: { subject: SubjectForDoctorReportModel }) => {
    const isFinish = subject.unCompletedTypes.length == 0
    return (
        <div className={'col-10 col-md-5 col-xl-3'}>
            <div className="border border-3 border-primary p-3 text-center position-relative"
                 style={{
                     backgroundColor: 'whitesmoke'
                 }}
            >
                <div
                    className={`position-absolute top-0 end-0 
                    border border-3 ${isFinish ? 'border-primary' : 'border-danger'}
                     p-3 p-sm-1 p-lg-2 border-top-0 border-end-0`}>
                    {isFinish ?
                        <FontAwesomeIcon icon={faCheck} className={'text-primary'}/> :
                        <FontAwesomeIcon icon={faX} className={'text-danger'}/>}
                </div>
                <div className={'w-75 mx-auto'}>
                    <h3>{subject.name}</h3>
                    <h4>{subject.department}</h4>
                    <h5>#{subject.code}</h5>
                </div>
                <hr/>
                <h3>Completed Types</h3>
                <div className="list-group">
                    {subject.completedTypes.length > 0 ? subject.completedTypes.map(t =>
                            <div key={t.valueOf()} className={'list-group-item list-group-item-primary'}>
                                {SubjectFileTypes[t]}
                            </div>) :
                        <div className={'text-center text-danger'}>
                            <b>No Completed Types!!!</b>
                        </div>}
                </div>

                <hr/>
                <h3>UnCompleted Types</h3>
                <div className="list-group">
                    {subject.unCompletedTypes.length > 0 ? subject.unCompletedTypes.map(t =>
                            <div key={t.valueOf()} className={'list-group-item list-group-item-danger'}>
                                {SubjectFileTypes[t]}
                            </div>) :
                        <div className={'text-center text-primary'}>
                            <b>No UnCompleted Types!, All Is Done!</b>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default SubjectFileForDoctorReport;