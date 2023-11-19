import React, {useEffect, useRef} from 'react';
import useAppSelector from "../../Hookes/useAppSelector";
import useAppDispatch from "../../Hookes/useAppDispatch";
import {loadMoreMessages} from "../../App/Feutures/Room/roomSlice";
import useAxiosApi from "../../Hookes/useAxiosApi";
import {MyButton} from "../../Components/Form/MyButton";

const Messages = ({roomId}: { roomId: string }) => {
    const screenHeight = window.innerHeight
    const height = `${screenHeight - 48 - 48 - 64 - 16 * 2}px`
    const messageRef = useRef<HTMLDivElement>(null)
    const myId = useAppSelector(s => s.auth.id)
    const messages = useAppSelector(s => s.room.rooms[roomId])
    const api = useAxiosApi()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!messages)
            return

        const {scrollHeight, clientHeight, scrollTop} = messageRef.current!
        const threshold = 150

        if (messages[messages.length - 1]?.sender.id != myId || (clientHeight - scrollTop - threshold) > scrollHeight)
            return

        messageRef.current?.scroll({
            top: scrollHeight - clientHeight,
            behavior: 'smooth'
        })
    }, [messages])

    const loadMore = () => {
        dispatch(loadMoreMessages({
            api,
            roomId,
            messagesCount: 150,
            date: messages[0]?.date as unknown as Date ?? new Date().toUTCString() as unknown as Date
        }))
    }

    return <div className={`flex flex-col items-end gap-3 w-full overflow-y-scroll`} style={{height}} ref={messageRef}>
        <MyButton type={'button'} onClick={_ => loadMore()}>load more</MyButton>
        {messages?.map((m, i) => <div key={m.id + i}
                                      className={'border p-3 w-8/12' + (m.sender.id == myId ? ' ml-auto' : ' mr-auto')}>
            <div>{m.sender?.userName}</div>
            <div>{m.text}</div>
            {m.sender.id == myId && <div className={'text-end'}>
                {m.isRead ? 'read' :
                    m.isDelivered ? 'delivered' :
                        m.serverReached ? 'sent' :
                            'waiting'}
            </div>}
        </div>)}
    </div>
};

export default Messages;