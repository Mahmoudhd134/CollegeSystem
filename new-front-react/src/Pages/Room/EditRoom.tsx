import React, {useEffect} from 'react';
import {useEditRoomMutation} from "../../App/Api/RoomApi";
import {Dialog} from "@material-tailwind/react";
import {Form, Formik} from "formik";
import RoomModel from "../../App/Models/Room/RoomModel";
import {object, string} from 'yup'
import MyInputField from "../../Components/Form/MyInputField";
import {MyButton} from "../../Components/Form/MyButton";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";

type Props = {
    room: RoomModel,
    isOpen: boolean,
    switchOpen: () => void,
    close: () => void
}
const EditRoom = ({room, isOpen, switchOpen, close}: Props) => {
    const [editRoom, editRoomResult] = useEditRoomMutation()
    useEffect(() => {
        if (editRoomResult.isSuccess)
            close()
    }, [editRoomResult.isSuccess])

    return <Dialog open={isOpen} handler={switchOpen}>
        <Formik initialValues={{
            id: room.id,
            name: room.name
        }}
                onSubmit={editRoom}
                validationSchema={object({
                    name: string().required('name is required')
                })}
        >
            <Form>
                <FormFieldWrapper>
                    <MyInputField name={'name'} label={'New Name'}/>
                </FormFieldWrapper>
                <div className="flex justify-center">
                    <MyButton type={'submit'}>Edit</MyButton>
                </div>
            </Form>
        </Formik>
    </Dialog>

};

export default EditRoom;