import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import TimeAgo from "../../Components/Global/TimeAgo";
import PaginationWithUrlSearchParams from "../../Components/Global/PaginationWithUrlSearchParams";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {MyButton} from "../../Components/Form/MyButton";
import {useDeleteMailMutation, useGetSendMailsQuery} from "../../App/Api/MailApi";

const SentMails = () => {
    const pageSize = 10
    const navigator = useAppNavigator()
    const {searchParams, updateSearchParams} = useMySearchParams()
    const pageIndex = +(searchParams.get('page') ?? 1) - 1
    const {data, isFetching, isError, error} = useGetSendMailsQuery({
        pageIndex,
        pageSize
    })
    const [remove, removeResult] = useDeleteMailMutation()

    let messagesUi = <h3>Init Value</h3>
    if (isFetching)
        messagesUi = <h3>Loading</h3>

    if ((isError || !data) && !isFetching)
        messagesUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    messagesUi = (data && !isError && !isFetching) ? <div className={'flex flex-col gap-3'}>
            {data.map(x => <div key={x.id}
                                className={'text-xl sm:text-lg hover:cursor-pointer hover:-translate-y-0.5 transition-all flex flex-col border rounded-xl p-3'}
                                onClick={_ => navigator('/Mail/' + x.id)}>
                <div className={'mt-1 mb-3'}>from: {x.senderUsername}</div>
                <div>{x.title}</div>
                <div className={'text-lg sm:text-md'}><TimeAgo timestamp={x.date}/></div>
                <MyButton type={'button'}
                          onClick={async e => {
                              e.stopPropagation()
                              await remove(x.id)
                          }}
                ><FontAwesomeIcon color={'red'} icon={faTrash}/></MyButton>
            </div>)}
        </div> :
        messagesUi

    return <>
        {messagesUi}
        <PaginationWithUrlSearchParams
            pageIndex={pageIndex}
            setPage={(newPage) => updateSearchParams({page: newPage})}
            hasPrev={pageIndex > 0}
            hasNext={(data?.length ?? 0) == pageSize}
            className={'my-3'}
        />

    </>
};

export default SentMails;