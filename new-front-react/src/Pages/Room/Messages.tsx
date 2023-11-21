import React, {useEffect, useRef, useState} from 'react';
import useAppSelector from "../../Hookes/useAppSelector";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {loadMoreMessages} from "../../App/Feutures/Room/roomSlice";
import useAxiosApi from "../../Hookes/useAxiosApi";
import {MyButton} from "../../Components/Form/MyButton";
import TimeAgo from "../../Components/Global/TimeAgo";
import {
    Avatar,
    IconButton, SpeedDial,
    SpeedDialAction,
    SpeedDialContent,
    SpeedDialHandler, Spinner,
    Typography
} from "@material-tailwind/react";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";
import useScreenDimensions from "../../Hookes/useScreenDimensions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {EllipsisVerticalIcon} from "@heroicons/react/24/outline";

const Messages = ({roomId, doctorId}: { roomId: string, doctorId: string }) => {
    const screenDimensions = useScreenDimensions()
    const height = `${screenDimensions.height - 48 - 48 - 64 - 16 * 2}px`
    const messageRef = useRef<HTMLDivElement>(null)
    const myId = useAppSelector(s => s.auth.id)
    const {roomsMessages, loadCountAtOnce: messagesCount, connection} = useAppSelector(s => s.room)
    const messages = roomsMessages[roomId]?.messages
    const hasMore = roomsMessages[roomId]?.hasMore
    const isLoading = roomsMessages[roomId]?.isLoading
    const isLoadedMore = roomsMessages[roomId]?.isLoadedMore
    const api = useAxiosApi()
    const dispatch = useAppDispatch()
    const [scrollToDown, setScrollToDown] = useState(false)
    const [dif, setDif] = useState<number>(1)
    const [scrollOnNewMessage, setScrollOnNewMessage] = useState(true)
    console.log({scrollToDown, scrollOnNewMessage, hasMore})

    useEffect(() => {
        if (messages?.length == 0 && hasMore)
            loadMore()

        if (!messages || messages.length == 0 || !messageRef.current)
            return

        if (isLoadedMore) {
            const {scrollHeight, clientHeight} = messageRef.current
            if (messages[messages.length - 1].sender.id == myId || scrollOnNewMessage) {
                if (scrollToDown) {
                    messageRef.current.scroll({
                        top: scrollHeight - clientHeight,
                        behavior: 'smooth'
                    })
                }
            }
            if (!scrollToDown) {
                console.log({scrollHeight, dif})
                messageRef.current.scroll({
                    top: scrollHeight - dif,
                })
            }
        }

        setScrollToDown(true)
        const handle = () => {
            const {scrollHeight: SC, clientHeight: CH, scrollTop: ST} = messageRef.current!
            setScrollOnNewMessage(SC == CH + ST)
            if (ST == 0 && hasMore)
                loadMore()
        }
        messageRef.current?.addEventListener('scroll', handle)
        return () => messageRef.current?.removeEventListener('scroll', handle)
    }, [messages?.length, hasMore])

    const loadMore = (scroll: boolean = false) => {
        if (isLoading || !hasMore)
            return
        const {scrollTop, scrollHeight} = messageRef.current!
        setDif(scrollHeight - scrollTop)
        setScrollToDown(scroll)
        const date = (messages && messages[0])?.date as unknown as Date ?? new Date().toUTCString() as unknown as Date
        dispatch(loadMoreMessages({api, roomId, date, messagesCount,}))
    }

    const deleteMessage = (messageId: string) => () => connection?.invoke('DeleteMessage', roomId, messageId)


    return <div className={`flex flex-col items-end gap-3 w-full overflow-y-scroll relative`}
                style={{height}}
                ref={messageRef}>

        {hasMore ?
            <div className="mx-auto">
                {isLoading ? <Spinner/> : <MyButton type={'button'} onClick={_ => loadMore()}>load more</MyButton>}
            </div> : <span className={'mx-auto'}>Finished</span>}

        {messages?.map((m, i) => <div key={m.id + i}
                                      className={'bg-blue-900 text-white rounded-3xl p-3 max-w-[66%] relative' + (m.sender.id == myId ? ' ml-auto' : ' mr-auto')}>
            <div className={'mb-1 flex items-center flex-wrap'}>
                <a href={PROFILE_IMAGES_URL + m.sender.image} target={'_blank'}>
                    <Avatar src={PROFILE_IMAGES_URL + m.sender.image} size={'sm'} className={'w-8 h-8 mx-1'}/>
                </a>
                {m.sender?.userName}{m.sender?.id == doctorId && '(doctor)'}
                {m.sender.id == myId && <div className="ml-auto">
                    <SpeedDial>
                        <SpeedDialHandler>
                            <IconButton size="sm" color={"blue"} className="rounded-full">
                                <EllipsisVerticalIcon className={'h-5 w-5'}/>
                            </IconButton>
                        </SpeedDialHandler>
                        <SpeedDialContent>
                            <SpeedDialAction onClick={deleteMessage(m.id)} className={'bg-blue-200'}>
                                <FontAwesomeIcon icon={faTrash}
                                                 className={'hover:cursor-pointer'}
                                                 color={'red'}
                                />
                            </SpeedDialAction>
                        </SpeedDialContent>
                    </SpeedDial>
                </div>}
            </div>
            <Typography variant={'paragraph'}>{m.text}</Typography>
            <div className={'text-end'}>
                {(m.sender.id != myId || m.serverReached || m.isRead) ?
                    <TimeAgo timestamp={m.date} className={'mx-3'}/> :
                    <span>after seconds</span>}
                {m.sender.id == myId && <span>
                {m.isRead ? 'read' :
                    m.serverReached ? 'sent' :
                        'waiting'}
            </span>}
            </div>
        </div>)}
    </div>
};

export default Messages;