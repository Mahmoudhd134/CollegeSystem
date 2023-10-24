import {useParams} from "react-router-dom";
import {useGetSubjectReportQuery} from "../../App/Api/SubjectApi";
import SubjectReportField from "./SubjectReportField";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";

const SubjectReport = () => {
    const {id} = useParams()
    const {data, isFetching, isError, error} = useGetSubjectReportQuery(Number(id! ?? ''))
    //yofo handle other states

    const completedTypes = data?.files
        .map(f => f.type.valueOf())
        .reduce((prev, curr) => prev.some(p => p == curr) ? prev : [...prev, curr], [] as number[])

    const isComplete = completedTypes?.length == (Object.keys(SubjectFileTypes).length / 2)


    return (
        <main className={'mt-3'}>
            <div className="container">
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

                <h3 className="text-center">{data?.name}</h3>
                <div className="row justify-content-center align-items-end">
                    <SubjectReportField title={'Department'} value={data?.department ?? ''}/>
                    <SubjectReportField title={'Code'} value={data?.code.toString() ?? ''}/>
                    <SubjectReportField title={'Hours'} value={data?.hours.toString() ?? ''}/>
                    {data?.hasADoctor ? <SubjectReportField title={'Doctor'} value={'Dose not has a doctor yet'}/> :
                        <>
                            <SubjectReportField title={'Doctor First Name'} value={data?.doctor.firstname ?? ''}/>
                            <SubjectReportField title={'Doctor Last Name'} value={data?.doctor.lastname ?? ''}/>
                            <SubjectReportField title={'Doctor Username'} value={data?.doctor.username ?? ''}/>
                            <SubjectReportField title={'Doctor National Number'}
                                                value={data?.doctor.nationalNumber ?? ''}/>
                            <SubjectReportField title={'Doctor Email'} value={data?.doctor.email ?? ''}/>
                            <SubjectReportField title={'Doctor Phone Number'} value={data?.doctor.phoneNumber ?? ''}/>
                        </>
                    }
                    <div className="col-12 col-sm-5 col-md-4 col-lg-3 position-relative my-2">
                        <input type="text" disabled value={'Is Complete'}
                               className={'form-control'}
                        />
                        <span className={'col-form-label position-absolute'}
                              style={{
                                  top: '0',
                                  right: '10%',
                              }}
                        >
                            {isComplete ?
                                <FontAwesomeIcon className={'text-primary'} icon={faCheck}/> :
                                <FontAwesomeIcon className={'text-danger'} icon={faX}/>}
                        </span>
                    </div>
                </div>

                {(completedTypes?.length ?? -1) > 0 &&
                    <>
                        <h3 className={'text-center'}>Files!!</h3>
                        <div className="row justify-content-center text-sm-center">
                            {Object.keys(SubjectFileTypes)
                                .map(k => +k)
                                .filter(k => !isNaN(+k))
                                .sort((a, b) => a - b)
                                .map(t =>
                                    <div key={t} className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3 list-group my-3">
                                        <div className="list-group-item list-group-item-action active">
                                            {SubjectFileTypes[t]}
                                        </div>
                                        {(data?.files
                                            .filter(f => f.type == t)
                                            .length ?? -1) > 0 ?
                                            data?.files
                                                .filter(f => f.type == t)
                                                .map(f =>
                                                    <div key={f.id}
                                                         className="list-group-item list-group-item-action">
                                                        {f.name}
                                                    </div>
                                                ) :
                                            <div
                                                className="list-group-item list-group-item-action list-group-item-danger">
                                                No Files!!!
                                            </div>}
                                    </div>
                                )}
                        </div>
                    </>}
            </div>
        </main>
    )
        ;
};

export default SubjectReport;