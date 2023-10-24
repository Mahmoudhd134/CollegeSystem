import {useDeleteMessageMutation, useGetSendMessageQuery} from "../../App/Api/MessageApi";
import React, {useRef, useState} from "react";
import Pagination from "../Pagination";
import TimeAgo from "../Global/TimeAgo";
import {useLocation, useNavigate} from "react-router-dom";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SentMessages = () => {
    const pageSize = 10
    const [page, setPage] = useState(0)
    const {data, isFetching, isError, error} = useGetSendMessageQuery({pageSize, pageIndex: page})
    const [hoverId, setHoverId] = useState(-1)
    const [remove, removeResult] = useDeleteMessageMutation()
    const [idToRemove, setIdToRemove] = useState<number | null>(null)
    const twoStepRemoveScreen = useRef() as React.MutableRefObject<HTMLDivElement>

    const navigator = useNavigate()
    const loc = useLocation()

    const removeHandlerOne = (id: number) => {
        return (e: React.MouseEvent<SVGSVGElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIdToRemove(id)
        }
    }

    const removeHandlerTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        remove(idToRemove!)
        setIdToRemove(null)
    }

    const returnBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIdToRemove(null)
    }

    if (isFetching)
        return <h3>Loading...</h3>

    return (
        <>
            {idToRemove && <div ref={twoStepRemoveScreen}
                                className='border border-3 roudned rounded-3 mx-auto p-3'>
                <h3 className='text-center'>Are You Sure You Want To
                    Delete <br/>"{data?.filter(d => d.id == idToRemove)[0].title.slice(0, 30) ?? '' +
                        ((data?.filter(d => d.id == idToRemove)[0].title.length ?? 100) > 30 && '...')}"
                </h3>
                <div className="row justify-content-center gap-4">
                    <div className="col-4">
                        <button onClick={removeHandlerTwo} className='btn btn-outline-danger'>Remove Any Way</button>
                    </div>

                    <div className="col-4">
                        <button onClick={returnBack} className='btn btn-outline-primary'>Return Back</button>
                    </div>
                </div>
            </div>}
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>To</th>
                    <th>Titel</th>
                    <th>#</th>
                </tr>
                </thead>
                <tbody>
                {data?.map(m => <tr key={m.id}
                                    onMouseEnter={e => setHoverId(m.id)}
                                    onMouseLeave={e => setHoverId(-1)}
                                    onClick={e => navigator(`/message/${m.id}`, {state: {from: loc}})}
                >
                    <td>{m.receiverUsername}</td>
                    <td>{m.title}</td>
                    {m.id == hoverId ?
                        <td>
                            <FontAwesomeIcon
                                icon={faTrash}
                                onClick={removeHandlerOne(m.id)}
                                style={{cursor: 'pointer'}}
                                className={'text-danger'}/>
                        </td> :
                        <td><TimeAgo timestamp={m.date}/></td>}
                </tr>)}
                </tbody>
            </table>
            <Pagination page={page} setPage={setPage} hasNext={(data?.length ?? -1) < pageSize - 1}/>
        </>
    );
};

export default SentMessages;