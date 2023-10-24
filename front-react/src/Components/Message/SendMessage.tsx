import {useLocation, useNavigate, useParams} from "react-router-dom";
import useAppSelector from "../../Hookes/useAppSelector";
import {useAddMessageMutation} from "../../App/Api/MessageApi";
import React, {useEffect, useState} from "react";

const SendMessage = () => {
    const {receiverId, receiverName} = useParams()
    const username = useAppSelector(s => s.auth.username)
    const [add, {isSuccess, data, error, isError, isLoading}] = useAddMessageMutation()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigator = useNavigate()
    const loc = useLocation()

    const handelClick = (e: React.MouseEvent) => {
        e.preventDefault()
        add({receiverId: receiverId!, title, content})
    }

    useEffect(() => {
        if (isSuccess)
            navigator(loc.state?.from ?? `/doctor/${receiverId}`)
    }, [isSuccess])

    return (
        <main>
            <div className="container">
                <div className="input-group mb-3">
                    <span className="input-group-text">From</span>
                    <input type="text" disabled className="form-control" value={username as string}/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text">To</span>
                    <input type="text" className="form-control" value={receiverName} disabled/>
                </div>

                <input type="text" placeholder={'Title...'} className={'form-control my-5'} value={title}
                       onChange={e => setTitle(e.currentTarget.value)}/>

                <textarea placeholder={'Content...'} className={'form-control my-5'} value={content}
                          onChange={e => setContent(e.currentTarget.value)}/>

                <div className="text-center">
                    <button className={'btn btn-primary mx-auto ' + (isLoading && 'disabled')}
                            onClick={handelClick}
                    >{isLoading ?
                        <div className="spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : 'Add'}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SendMessage;