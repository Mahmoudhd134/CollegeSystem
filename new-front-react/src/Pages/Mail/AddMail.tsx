import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import {Form, Formik} from "formik";
import {AddMailModel} from "../../App/Models/Mail/AddMailModel";
import * as Yup from 'yup'
import MyInputField from "../../Components/Form/MyInputField";
import MyTextAreaField from "../../Components/Form/MyTextAreaField";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import {MyButton} from "../../Components/Form/MyButton";
import getAppError from "../../Utilites/getAppError";
import {useState} from "react";
import {Spinner} from "@material-tailwind/react";
import {useAddMailMutation} from "../../App/Api/MailApi";

const AddMail = () => {
    const {searchParams, updateSearchParams} = useMySearchParams()
    const [add, addResult] = useAddMailMutation()
    const [sending, setSending] = useState(false);
    const userName = searchParams.get('userName') ?? undefined
    const id = searchParams.get('id') ?? undefined

    const send = async (values: AddMailModel) => {
        setSending(true)
        await add(values)
        setSending(false)
    }

    const initialValues: AddMailModel = {
        content: '',
        title: '',
        receiverId: id!
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('title is required').max(255),
        content: Yup.string().required('content is required').max(2047),
    })

    return (
        <div className={'my-container min-h-remaining'}>
            {addResult.isSuccess && <h3 className={'text-2xl sm:text-xl text-center text-blue-900'}>
                Message Send Successfully
            </h3>}
            {addResult.isError && <h3 className={'text-2xl sm:text-xl text-center text-red-900'}>
                {getAppError(addResult.error)?.message}
            </h3>}
            <FormFieldWrapper>
                <label className={'block mb-2'}>To</label>
                <input type="text"
                       className={'border-2 border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl mt-1 w-full'}
                       disabled={!!id}
                       value={userName}
                />
            </FormFieldWrapper>
            <Formik {...{initialValues, validationSchema}} onSubmit={send}>
                {({handleSubmit}) => <Form onSubmit={handleSubmit}>
                    <FormFieldWrapper>
                        <MyInputField name={'title'} label={'Title'} placeholder={'Title...'}/>
                    </FormFieldWrapper>

                    <FormFieldWrapper>
                        <MyTextAreaField name={'content'} label={'Content'} placeholder={'Content...'}/>
                    </FormFieldWrapper>

                    <div className="w-full flex justify-center">
                        {sending ? <Spinner/> : <MyButton type={'submit'}>Send</MyButton>}
                    </div>
                </Form>}
            </Formik>
        </div>
    );
};

export default AddMail