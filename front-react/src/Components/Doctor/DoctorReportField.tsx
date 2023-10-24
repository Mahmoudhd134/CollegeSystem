const DoctorReportField = ({title, value}: { title: string, value: string }) => {
    return (
        <div className="col-12 col-sm-5 col-md-4 col-lg-3">
            <div className={'col-form-label'}>{title}</div>
            <input type="text" disabled value={value}
                   className={'form-control'}
            />
        </div>
    );
};

export default DoctorReportField;
