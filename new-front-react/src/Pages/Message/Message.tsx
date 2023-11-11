import {useParams} from "react-router-dom";
import {useGetMessageByIdMutation} from "../../App/Api/MessageApi";
import {useEffect} from "react";
import AppLink from "../../Components/Navigation/AppLink";
import TimeAgo from "../../Components/Global/TimeAgo";

const Message = () => {
    const {id} = useParams()
    const [get, {data, isLoading, isError, error}] = useGetMessageByIdMutation()

    useEffect(() => {
        get(+id!)
    }, [])

    let messageUi = <h3>Init Value</h3>
    if (isLoading)
        messageUi = <h3>Loading</h3>

    if ((isError || !data) && !isLoading)
        messageUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    messageUi = (data && !isLoading && !isError) ? <div>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        {data.senderUsername}
                    </div>
                    <span className="block mt-1 text-lg leading-tight font-medium text-black">
                        {data.title}
                    </span>
                    <p className="mt-2 text-gray-500"><pre>{data.content}</pre></p>
                    <p className="mt-4 text-gray-600">
                        <TimeAgo timestamp={data.date}/>
                    </p>
                    <div className="mt-4">
            <span className="text-indigo-600 font-semibold">
              Receiver: <AppLink to={'/Doctor/' + data.receiverId}>{data.receiverUsername}</AppLink>
            </span>
                    </div>
                </div>
            </div>
        </div>
    </div> : messageUi

    return <div className={'my-container'}>
        {messageUi}
    </div>
};

export default Message;