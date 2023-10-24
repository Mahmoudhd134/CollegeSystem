import {useState} from "react";
import {useGetReceivedMessageQuery} from "../../App/Api/MessageApi";
import TimeAgo from "../Global/TimeAgo";
import Pagination from "../Pagination";
import {useLocation, useNavigate} from "react-router-dom";

const InboxMessages = () => {
    const pageSize = 10
    const [page, setPage] = useState(0)
    const {data, isFetching, isError, error} = useGetReceivedMessageQuery({pageSize, pageIndex: page})
    const navigator = useNavigate()
    const loc = useLocation()

    if (isFetching)
        return <h3>Loading...</h3>

    return (
        <>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>From</th>
                    <th>Titel</th>
                    <th>#</th>
                </tr>
                </thead>
                <tbody>
                {data?.map(m => <tr key={m.id} className={`${m.read ? 'opacity-75' : 'opacity-100'}`}
                                    onClick={e => navigator(`/message/${m.id}`, {state: {from: loc}})}
                >
                    <td>{m.senderUsername}</td>
                    <td>{m.title}</td>
                    <td><TimeAgo timestamp={m.date}/></td>
                </tr>)}
                </tbody>
            </table>
            <Pagination page={page} setPage={setPage} hasNext={(data?.length ?? -1) < pageSize - 1}/>
        </>
    )
};

export default InboxMessages;