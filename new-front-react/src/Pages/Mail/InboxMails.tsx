import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import PaginationWithUrlSearchParams from "../../Components/Global/PaginationWithUrlSearchParams";
import TimeAgo from "../../Components/Global/TimeAgo";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {useGetReceivedMailsQuery} from "../../App/Api/MailApi";

const InboxMails = () => {
    const pageSize = 10
    const navigator = useAppNavigator()
    const {searchParams, updateSearchParams} = useMySearchParams()
    const pageIndex = +(searchParams.get('page') ?? 1) - 1
    const {data, isFetching, isError, error} = useGetReceivedMailsQuery({
        pageIndex,
        pageSize
    })

    let messagesUi = <h3>Init Value</h3>
    if (isFetching)
        messagesUi = <h3>Loading</h3>

    if ((isError || !data) && !isFetching)
        messagesUi = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    messagesUi = (data && !isError && !isFetching) ? <div className={'flex flex-col gap-3'}>
            {data.map(x => <div key={x.id}
                                className={(x.read ? 'text-xl sm:text-lg opacity-75' : 'text-2xl sm:text-xl') + ' hover:cursor-pointer hover:-translate-y-0.5 transition-all flex flex-col border rounded-xl p-3'}
                                onClick={_ => navigator('/Mail/' + x.id)}>
                <div className={'mt-1 mb-3'}>from: {x.senderUsername}</div>
                <div>{x.title}</div>
                <div className={x.read ? 'text-lg sm:text-md' : 'text-xl sm:text-lg'}><TimeAgo timestamp={x.date}/></div>
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

export default InboxMails;