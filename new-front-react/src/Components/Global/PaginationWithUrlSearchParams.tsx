type Props = {
    pageIndex: number,
    setPage: (newPage: number) => void
    hasPrev: boolean,
    hasNext: boolean,
    className?: string
}
const PaginationWithUrlSearchParams = ({pageIndex, hasNext, hasPrev, setPage, className = ''}: Props) => {
    return (
        <div className={className}>
            <div
                className={'flex my-1 mx-auto bg-blue-50 border border-blue-300 rounded-lg w-3/4 sm:w-1/2 md:w-1/3 xl:w-1/4'}>
                <button className={'w-3/12 border-x-2 border-blue-200'} disabled={!hasPrev}
                        onClick={_ => setPage(pageIndex)}>Prev
                </button>
                <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-100'}>{pageIndex}</button>
                <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-200'}>{pageIndex + 1}</button>
                <button disabled className={'w-2/12 border-x-2 border-blue-200 bg-blue-100'}>{pageIndex + 2}</button>
                <button className={'w-3/12 border-x-2 border-blue-200'} disabled={!hasNext}
                        onClick={_ => setPage(pageIndex + 2)}>Next
                </button>
            </div>
        </div>);
};

export default PaginationWithUrlSearchParams;