import React, {useEffect, useRef} from 'react';
import useAppSelector from "../../Hookes/useAppSelector";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {loadMoreMessages} from "../../App/Feutures/Room/roomSlice";
import useAxiosApi from "../../Hookes/useAxiosApi";
import {MyButton} from "../../Components/Form/MyButton";
import TimeAgo from "../../Components/Global/TimeAgo";
import {Avatar, Typography} from "@material-tailwind/react";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import useScreenDimensions from "../../Hookes/useScreenDimensions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const Messages = ({roomId, doctorId}: { roomId: string, doctorId: string }) => {
    const screenDimensions = useScreenDimensions()
    const height = `${screenDimensions.height - 48 - 48 - 64 - 16 * 2}px`
    const messageRef = useRef<HTMLDivElement>(null)
    const myId = useAppSelector(s => s.auth.id)
    const {roomsMessages, loadCountAtOnce, connection} = useAppSelector(s => s.room)
    const messages = roomsMessages[roomId]?.messages
    const hasMore = roomsMessages[roomId]?.hasMore
    const api = useAxiosApi()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (messages?.length == 0)
            loadMore()
    }, [messages?.length])

    useEffect(() => {
        if (!messages || !messageRef.current)
            return
    }, [messages])

    //todo implement infinite scrolling
    const loadMore = () => {
        dispatch(loadMoreMessages({
            api,
            roomId,
            messagesCount: loadCountAtOnce,
            date: (messages && messages[0])?.date as unknown as Date ?? new Date().toUTCString() as unknown as Date
        }))
    }

    const deleteMessage = (messageId: string) => () => connection?.invoke('DeleteMessage', roomId, messageId)


    return <div className={`flex flex-col items-end gap-3 w-full overflow-y-scroll`} style={{height}} ref={messageRef}>
        <MyButton type={'button'} onClick={_ => loadMore()}>load more</MyButton>
        {messages?.map((m, i) => <div key={m.id + i}
                                      className={'bg-blue-900 text-white rounded-3xl p-3 max-w-[66%]' + (m.sender.id == myId ? ' ml-auto' : ' mr-auto')}>
            <div className={'mb-1'}>
                <a href={PROFILE_IMAGES_URL + m.sender.image} target={'_blank'}>
                    <Avatar src={PROFILE_IMAGES_URL + m.sender.image} size={'sm'} className={'w-8 h-8 mx-1'}/>
                </a>
                {m.sender?.userName}{m.sender?.id == doctorId && '(doctor)'}
            </div>
            <Typography variant={'paragraph'}>{m.text}</Typography>
            <div className={'text-end'}>
                {(m.sender.id != myId || m.serverReached || m.isRead || m.isDelivered) ?
                    <TimeAgo timestamp={m.date} className={'mx-3'}/> :
                    <span>after seconds</span>}
                {m.sender.id == myId && <span>
                {m.isRead ? 'read' :
                    m.isDelivered ? 'delivered' :
                        m.serverReached ? 'sent' :
                            'waiting'}
            </span>}
            </div>
            {m.sender.id == myId &&
                <FontAwesomeIcon icon={faTrash}
                                 className={'hover:cursor-pointer'}
                                 color={'red'}
                                 onClick={deleteMessage(m.id)}
                />}
        </div>)}
    </div>
};

export default Messages;