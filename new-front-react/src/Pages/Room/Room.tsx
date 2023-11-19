import {useParams} from "react-router-dom";
import {ROOM_IMAGES_URL} from "../../App/Api/axiosApi";
import {useGetRoomQuery, useJoinRoomMutation} from "../../App/Api/RoomApi";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faGear} from "@fortawesome/free-solid-svg-icons";
import React, {lazy, Suspense, useEffect, useRef, useState} from "react";
import Messages from "./Messages";
import {MyButton} from "../../Components/Form/MyButton";
import AddMessageModel from "../../App/Models/Message/AddMessageModel";
import useAppSelector from "../../Hookes/useAppSelector";
import RoomMessageModel from "../../App/Models/Message/RoomMessageModel";
import {v4 as uuidV4} from 'uuid'
import useAppDispatch from "../../Hookes/useAppDispatch";
import {
    addMessage,
    buildRoomConnection,
    updateTempMessage,
    startRoomConnection,
    stopRoomConnection,
    getUnReadMessageForRoom,
    makeMessagesIsReadToTrue,
    makeMessageIsDeliveredToTrue,
    updateMessagesState
} from "../../App/Feutures/Room/roomSlice";
import {removeNotificationsForRoom} from "../../App/Feutures/App/AppSlice";
import useAxiosApi from "../../Hookes/useAxiosApi";
import AppLink from "../../Components/Navigation/AppLink";

const RoomSettings = lazy(() => import('../Room/RoomSettings'))
const Room = () => {
    const {id} = useParams()
    const {data: room, isFetching: roomDateFetching, isError, error} = useGetRoomQuery(id!)
    const [joinRoom, {isLoading: joinRoomLoading}] = useJoinRoomMutation()
    const inputRef = useRef<HTMLInputElement>(null)
    const {token, id: myId, username, profileImage} = useAppSelector(s => s.auth)
    const dispatch = useAppDispatch()
    const {connection, rooms} = useAppSelector(s => s.room)
    const api = useAxiosApi()
    const isMutating = roomDateFetching || joinRoomLoading
    const [openSettingsState, setOpenSettingState] = useState(false)
    const openSettings = () => setOpenSettingState(true)
    const closeSettings = () => setOpenSettingState(false)

    useEffect(() => {
        if (room)
            dispatch(getUnReadMessageForRoom({api, roomId: room.id}))
    }, [room?.id, dispatch])


    useEffect(() => {
        if (!room || !room.isJoined)
            return

        dispatch(buildRoomConnection({roomId: room.id, token: token!}))
        dispatch(startRoomConnection())
        dispatch(removeNotificationsForRoom(room.id))

        const ids = rooms[room.id]?.filter(m => m.sender.id == myId && !m.isRead).map(m => m.id) ?? []
        if (ids?.length > 0)
            dispatch(updateMessagesState({api, ids}))

        return () => {
            dispatch(stopRoomConnection())
        }
    }, [room?.id, room?.isJoined, dispatch, buildRoomConnection, startRoomConnection, stopRoomConnection])

    useEffect(() => {
        if (!connection)
            return

        connection.on("ReceiveMessage", (roomMessageModel: RoomMessageModel) => {
            dispatch(addMessage(roomMessageModel))
        })

        connection.on("MessageSendSuccessfully", (tempId: string, message: RoomMessageModel) => {
            dispatch(updateTempMessage({tempId, message}))
        })

        connection.on("MessagesHaveBeenRead", (ids: string[], roomId: string) => {
            dispatch(makeMessagesIsReadToTrue({roomId, ids}))
        })

        connection.on("MessagesHaveBeenDelivered", (ids: string[], roomId: string) => {
            dispatch(makeMessageIsDeliveredToTrue({ids, roomId}))
        })
    }, [connection])

    const addMessageHandler = (e: React.FormEvent) => {
        e.preventDefault()
        const text = inputRef.current?.value
        if (!text || text.length == 0)
            return
        const tempId = uuidV4()
        const addMessageModel: AddMessageModel = {
            tempId,
            text,
            roomId: room?.id!,
            sender: {
                id: myId!,
                image: profileImage!,
                userName: username!
            }
        }
        connection?.invoke("SendMessage", addMessageModel)
        inputRef.current!.value = ''

        const roomMessageModel: RoomMessageModel = {
            id: tempId,
            roomId: room?.id!,
            text,
            date: Date.now().toString(),
            sender: {
                id: myId!,
                image: profileImage!,
                userName: username!
            },
            isRead: false,
            isDelivered: false,
            serverReached: false
        }
        dispatch(addMessage(roomMessageModel))
    }

    let header = <header className={'flex gap-3 items-center bg-blue-400 rounded-xl px-3'}>
        <div>
            <img src={room ? (ROOM_IMAGES_URL + room?.image) : '/Images/default-room.png'} alt="room_image"
                 className="h-12 w-12 object-contain rounded-full"/>
        </div>

        <span className={isMutating ? 'animated-pulse' : ''}>{room?.name ?? 'room'}</span>
        <AppLink to={'/Subject/' + room?.subject.subjectCode}
                 className={'ml-auto mr-5' + (isMutating ? ' animated-pulse' : '')}
        >{room?.subject.subjectName ?? 'subject'}</AppLink>
        {(room && room.subject.doctorId == myId) && <>
            <FontAwesomeIcon
                onClick={openSettings}
                className={'hover:cursor-pointer'}
                icon={faGear}/>
            <Suspense fallback={<h3>loading settings</h3>}>
                <RoomSettings room={room} open={openSettingsState} onClose={closeSettings}/>
            </Suspense>
        </>}
    </header>

    let main = (!isMutating && room) ? <main className={`grow flex ${room?.isJoined ? 'items-center' : ''}`}>
            {room.isJoined ? <Messages 
                    roomId={room?.id}
                    doctorId={room?.subject.doctorId}
                /> :
                <h3 className={'flex justify-center self-center mx-auto'}>
                    You Must Join The Room First
                </h3>}
        </main> :
        <main className={'grow flex items-center justify-center'}>Wating Getting Information</main>

    let footer = (!isMutating && room) ? <footer className={'h-12 mt-auto'}>
            {room.isJoined ? <form className={'flex h-full'} onSubmit={addMessageHandler}>
                    <input type="text"
                           ref={inputRef}
                           className={'h-full w-11/12 bg-blue-700 border-2 border-r-0 dark:border-blue-950 rounded-l-xl p-1 text-2xl sm:text-xl focus:border-0'}
                           placeholder={'Message...'}
                    />

                    <button type={'submit'}
                            className={'border-2 border-l-0 dark:border-blue-950 rounded-r-xl w-1/12 p-3 bg-blue-800 hover:cursor-pointer black:hover:bg-blue-900 group'}>
                        <FontAwesomeIcon icon={faPaperPlane}
                                         className={'w-full h-full group-hover:-translate-y-1/4 group-hover:translate-x-1/4 transition-all'}/>
                    </button>
                </form> :
                <MyButton type={'button'} className={'w-full'} onClick={_ => joinRoom(room.id)}>
                    Join This Room
                </MyButton>}
        </footer> :
        <footer className={'h-12 mt-auto'}>Waiting Getting The Room</footer>

    return <div className={'dark:bg-blue-700'}>
        <div className={'my-container bg-blue-300 flex flex-col'}>
            {isError ? <h3>
                Room Not Found
            </h3> : <>
                {header}
                {main}
                {footer}
            </>}
        </div>
    </div>
}

export default Room;