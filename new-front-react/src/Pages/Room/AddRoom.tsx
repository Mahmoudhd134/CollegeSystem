import {useParams} from "react-router-dom";
import AddRoomModel from "../../App/Models/Room/AddRoomModel";
import {MyFormAttrs} from "../../global";
import * as Yup from 'yup'
import {Form, Formik} from "formik";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import MyInputField from "../../Components/Form/MyInputField";
import {MyButton} from "../../Components/Form/MyButton";
import {useAddRoomMutation} from "../../App/Api/RoomApi";
import {useEffect} from "react";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import FormError from "../../Components/Form/FormError";
import getAppError from "../../Utilites/getAppError";
import {Spinner} from "@material-tailwind/react";

const AddRoom = () => {
    const {code, id} = useParams()
    const [add, {isSuccess, isError, error, isLoading}] = useAddRoomMutation()
    const navigator = useAppNavigator()

    useEffect(() => {
        if (isSuccess)
            navigator('/Subject/' + code)
    }, [isSuccess])

    const form: MyFormAttrs<AddRoomModel> = {
        initialValues: {
            name: '',
            subjectId: +id!
        },
        validationSchema: Yup.object({
            name: Yup.string().required('name is required').max(255),
            subjectId: Yup.number().required()
        }),
        onSubmit: add
    }

    return <div className={'my-container'}>
        {isError && <FormError error={getAppError(error)!}/>}
        <Formik {...form}>
            <Form>
                <FormFieldWrapper>
                    <MyInputField name={'name'} label={'Room Name'} placeholder={'Room Name...'}/>
                </FormFieldWrapper>
                <div className={'flex justify-center'}>
                    {isLoading ? <Spinner/> : <MyButton type={'submit'}>Add</MyButton>}
                </div>
            </Form>
        </Formik>
    </div>
};

export default AddRoom;