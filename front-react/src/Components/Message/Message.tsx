import {useParams} from "react-router-dom";
import {useGetMessageByIdMutation} from "../../App/Api/MessageApi";
import {useEffect} from "react";
import useGetAppError from "../../Hookes/useGetAppError";
import Forbidden403 from "../Global/Forbidden/Forbidden403";

const Message = () => {
    const {id} = useParams()
    const [get, {data, isLoading, isError, error}] = useGetMessageByIdMutation()

    useEffect(() => {
        get(Number(id))
    }, [])

    if (isError)
        return <Forbidden403 errors={[{title: 'Error', text: useGetAppError(error)?.message ?? 'Unknown error'}]}/>

    return (
        <main>
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-12 col-sm-10 col-md-5 col-lg-4">
                        <div className={'col-form-label'}>From</div>
                        <input type="text" disabled value={data?.senderUsername}
                               className={'form-control'}
                        />
                    </div>

                    <div className="col-12 col-sm-10 col-md-5 col-lg-4">
                        <div className={'col-form-label'}>To</div>
                        <input type="text" disabled value={data?.receiverUsername}
                               className={'form-control'}
                        />
                    </div>
                </div>

                <div>
                    <div className="col-form-label">Title</div>
                    <input type="text" disabled className={'form-control'} value={data?.title}/>
                </div>

                <div>
                    <div className="col-form-label">Content</div>
                    <textarea disabled className={'form-control'} value={data?.content} style={{height: '300px'}}/>
                </div>
            </div>
        </main>
    );
};

export default Message;