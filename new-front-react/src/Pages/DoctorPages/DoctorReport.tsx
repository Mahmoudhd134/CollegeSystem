import React from 'react';
import {useParams} from "react-router-dom";
import {useGetDoctorReportQuery} from "../../App/Api/DoctorApi";

const DoctorReport = () => {
    const {id} = useParams()
    const {data} = useGetDoctorReportQuery(id!)
    return (
        <div className={'my-container min-h-remaining'}>
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

export default DoctorReport;