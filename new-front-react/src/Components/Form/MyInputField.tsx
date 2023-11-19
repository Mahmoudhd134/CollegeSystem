import {useField} from "formik";
import {HTMLInputTypeAttribute} from "react";
import {Input} from "@material-tailwind/react";

type Props = {
    name: string,
    label: string,
    placeholder?: string,
    type?:HTMLInputTypeAttribute
}
const MyInputField = (props: Props) => {
    const [field, meta] = useField(props.name)
    return (
        <div className={'flex flex-col'}>
            {/*<label htmlFor={props.name} className={'block mb-2'}>{props.label}</label>*/}
            {meta.touched && meta.error &&
                <label className={'text-red-900 block mb-1'}>{meta.error}</label>}
            <Input
                // className={'border-2 border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl mt-1 w-full'}
                error={meta.touched && !!meta.error}
                id={props.name}
                label={props.label}
                type={props.type}
                {...field}
            />
        </div>
    );
};


export default MyInputField;