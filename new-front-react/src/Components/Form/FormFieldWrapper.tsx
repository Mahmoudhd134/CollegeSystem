export const FormFieldWrapper = ({children}:any) => {
    return (
        <div className="w-full sm:w-8/12 md:w-5/12 mx-auto border border-gray-800 p-3 rounded-xl my-3">
            {children}
        </div>
    );
};