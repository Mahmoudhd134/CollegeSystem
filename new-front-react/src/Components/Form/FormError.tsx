import getAppError from "../../Utilites/getAppError";
import {AppError} from "../../App/Api/BaseApi";

const FormError = ({error}: { error: AppError }) => {
    return (
        <h3>
            <p className={"text-center text-red-500 text-2xl bg-blue-200 p-2"}>{error.message}</p>
        </h3>
    );
};

export default FormError;