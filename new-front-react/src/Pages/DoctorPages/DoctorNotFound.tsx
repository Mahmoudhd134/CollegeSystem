import {AppError} from "../../App/Api/BaseApi";
import './doctor.css'

const DoctorNotFound = ({id, error}: { id: string, error: AppError }) => {
    return (
        <div className={'min-h-remaining text-3xl sm:text-2xl'}>
            <div
                className="doctor-not-fount-responsive-container">
                <div className="text-center">There is something wrong with id '{id}'</div>
                <div className="text-center text-xl sm:text-md mt-3">{error.message}</div>
            </div>
        </div>
    );
};

export default DoctorNotFound;