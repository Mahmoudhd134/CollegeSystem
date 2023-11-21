import React, {useRef} from 'react';
import {
    Drawer,
    IconButton,
    Typography,
    DrawerProps,
} from "@material-tailwind/react";
import RoomModel from "../../App/Models/Room/RoomModel";
import {ROOM_IMAGES_URL} from "../../App/Api/axiosApi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import EditRoom from "./EditRoom";
import DeleteRoom from "./DeleteRoom";
import {useChangeRoomImageMutation} from "../../App/Api/RoomApi";

type Props = {
    room: RoomModel
} & Partial<DrawerProps>
const RoomSettings = (props: Props) => {
    const [openEditRoomDialog, setOpenEditRoomDialog] = React.useState(false);
    const [openDeleteRoomDialog, setOpenDeleteRoomDialog] = React.useState(false);
    const switchOpenEditRoomDialog = () => setOpenEditRoomDialog(p => !p);
    const switchOpenDeleteRoomDialog = () => setOpenDeleteRoomDialog(p => !p);
    const [changeImage, changeImageResult] = useChangeRoomImageMutation()
    const fileRef = useRef<HTMLInputElement>(null)

    const handleChangeImage = async () => {
        const file = fileRef.current?.files?.item(0)
        if (!file)
            return

        const formData = new FormData()
        formData.append('file', file)
        await changeImage({
            id: props.room.id,
            body: formData
        })
    }
    return <>
        {/*// @ts-ignore*/}
        <Drawer placement={'right'} {...props} color={'blue'} className={'bg-blue-300'}>
            <div className="flex items-center justify-between px-4 pb-2">
                <Typography variant="h5" color="blue-gray">
                    {props.room.name}
                    <FontAwesomeIcon icon={faPencil}
                                     className={'hover:cursor-pointer mx-7'}
                                     onClick={switchOpenEditRoomDialog}
                    />
                </Typography>

                <Typography variant='h5' color={'red'}>
                    <FontAwesomeIcon icon={faTrash}
                                     className={'hover:cursor-pointer'}
                                     onClick={switchOpenDeleteRoomDialog}
                    />
                </Typography>

                <IconButton variant="text" color="blue-gray" onClick={props.onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </IconButton>
            </div>
            <div className="mb-5 px-4">
                <img src={ROOM_IMAGES_URL + props.room.image} alt="room_image"
                     className="h-96 w-full rounded-xl object-contain object-center hover:cursor-pointer"
                     onClick={_ => fileRef.current?.click()}/>
                <input type="file" className="hidden" ref={fileRef} onChange={handleChangeImage}/>
            </div>
        </Drawer>
        <DeleteRoom
            room={props.room}
            isOpen={openDeleteRoomDialog}
            switchOpen={switchOpenDeleteRoomDialog}
            close={() => setOpenDeleteRoomDialog(false)}/>

        <EditRoom
            room={props.room}
            isOpen={openEditRoomDialog}
            switchOpen={switchOpenEditRoomDialog}
            close={() => setOpenEditRoomDialog(false)}/>
    </>

};

export default RoomSettings;