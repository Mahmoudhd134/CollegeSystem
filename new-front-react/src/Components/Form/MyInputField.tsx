import {useField} from "formik";

type Props = {
    name: string,
    label: string,
    placeholder?: string
}
const MyInputField = (props: Props) => {
    const [field, meta] = useField(props.name)
    return (
        <div className={'flex flex-col'}>
            <label htmlFor={props.name} className={'block mb-2'}>{props.label}</label>
            {meta.touched && meta.error &&
                <label className={'text-red-900 block mb-1'}>{meta.error}</label>}
            <input
                className={'border-2 border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl mt-1 w-full'}
                id={props.name}
                {...field}
                {...props}
            />
        </div>
    );
};


export default MyInputField;