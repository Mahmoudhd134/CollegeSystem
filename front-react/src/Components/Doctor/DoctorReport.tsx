import {useParams} from "react-router-dom";
import {useGetDoctorReportQuery} from "../../App/Api/DoctorApi";
import DoctorReportField from "./DoctorReportField";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SubjectFileForDoctorReport from "./SubjectFileForDoctorReport";

const DoctorReport = () => {
    const {id} = useParams()
    const {data, isError, error, isFetching} = useGetDoctorReportQuery(id!)
    //todo handle the other sates
    return (
        <div className={'bg-gradient'} style={{
            backgroundColor: "rgb(235,238,238)"
        }}>
            <div className="row mb-3 justify-content-center no-print">
                <div className="col-10 col-md-6 col-lg-4 col-xl-3">
                    <button className={'btn w-100'}
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #000082, #6942ef, #6554c0, #008cff, #000082, #6942ef)',
                                color: 'white',
                                fontFamily: 'cursive',
                                borderRadius: '30px',
                                border: 'none',
                                backgroundSize: '400%',
                                backgroundPosition: '0% 0%',
                            }}
                            onClick={e => window.print()}
                    >Print
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center gap-3">
                    <DoctorReportField title={'First Name'} value={data?.firstname ?? 'unknown'}/>
                    <DoctorReportField title={'Last Name'} value={data?.lastname ?? 'unknown'}/>
                    <DoctorReportField title={'User Name'} value={data?.username ?? 'unknown'}/>
                    <DoctorReportField title={'National Number'} value={data?.nationalNumber ?? 'unknown'}/>
                    <DoctorReportField title={'Email'} value={data?.email ?? 'unknown'}/>
                    <DoctorReportField title={'Phone Number'} value={data?.phoneNumber ?? 'unknown'}/>

                    <div className="col-12 col-sm-5 col-md-4 col-lg-3 position-relative">
                        <input type="text" disabled value={'Is Complete'}
                               className={'form-control'}
                        />
                        <span className={'col-form-label position-absolute'}
                              style={{
                                  top: '0',
                                  right: '10%',
                              }}
                        >
                            {data?.isComplete ?
                                <FontAwesomeIcon className={'text-primary'} icon={faCheck}/> :
                                <FontAwesomeIcon className={'text-danger'} icon={faX}/>}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{
                backgroundColor: "rgb(224,224,227)"
            }}>
                <div className={'container'}>
                    <h3 className={'text-center mt-5 mb-3'}>Files!!</h3>
                    <div className="row justify-content-center align-items-baseline gap-3 mb-5">
                        {data?.subjects.map(s =>
                            <SubjectFileForDoctorReport key={s.id} subject={s}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorReport;