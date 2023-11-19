import React, {useEffect, useState} from 'react';
import RoomModel from "../../App/Models/Room/RoomModel";
import {useDeleteRoomMutation} from "../../App/Api/RoomApi";
import {Button, Dialog, Input, Typography} from "@material-tailwind/react";
import {FormFieldWrapper} from "../../Components/Form/FormFieldWrapper";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";

type Props = {
    room: RoomModel,
    isOpen: boolean,
    switchOpen: () => void,
    close: () => void
}
const DeleteRoom = ({room, isOpen, switchOpen, close}: Props) => {
    const [canRemove, setCanRemove] = useState(false)
    const [deleteRoom, deleteRoomResult] = useDeleteRoomMutation()
    const navigator = useAppNavigator()
    useEffect(() => {
        if (deleteRoomResult.isSuccess)
            navigator('/Subject/' + room.subject.subjectCode)
    }, [deleteRoomResult.isSuccess])

    return <Dialog open={isOpen} handler={switchOpen}>
        <Typography>
            Are you sure you want to delete room '{room.name}' ?
        </Typography>
        <FormFieldWrapper>
            <Input label={'type room name to delete'}
                   onChange={e => setCanRemove(e.target.value == room.name)}/>
        </FormFieldWrapper>
        <div className="flex justify-center">
            <Button color={'red'} disabled={!canRemove}
                    onClick={async _ => await deleteRoom(room.id)}
            >Delete</Button>
        </div>
    </Dialog>
};

export default DeleteRoom;