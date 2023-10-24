import {Dispatch, SetStateAction} from "react";

type Props = {
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    hasPrev: boolean,
    hasNext: boolean
}

const Pagination = ({page, setPage, hasPrev, hasNext}: Props) => {
    return (<div
        className={'flex my-1 mx-auto bg-blue-50 border border-blue-300 rounded-lg w-3/4 sm:w-1/2 md:w-1/3 xl:w-1/4'}>
        <button className={'w-3/12 border-x-2 border-blue-200'} disabled={!hasPrev}
                onClick={e => setPage(p => p - 1)}>Prev
        </button>
        <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-100'}>{page}</button>
        <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-200'}>{page + 1}</button>
        <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-100'}>{page + 2}</button>
        <button className={'w-3/12 border-x-2 border-blue-200'} disabled={!hasNext}
                onClick={e => setPage(p => p + 1)}>Next
        </button>
    </div>)
}

export default Pagination