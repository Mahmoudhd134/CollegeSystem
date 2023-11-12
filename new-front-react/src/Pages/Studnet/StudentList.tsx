import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import PaginationWithUrlSearchParams from "../../Components/Global/PaginationWithUrlSearchParams";
import {useGetStudentListQuery} from "../../App/Api/StudentApi";
import React from "react";
import AppLink from "../../Components/Navigation/AppLink";
import {PROFILE_IMAGES_URL} from "../../App/Api/axiosApi";

const StudentList = () => {
    const PAGE_SIZE = 10
    const {searchParams, updateSearchParams, clearSearchParams} = useMySearchParams()
    const pageIndex = +(searchParams.get('page') ?? 1) - 1
    const usernamePrefix = searchParams.get('usernamePrefix') ?? undefined

    const {data, isSuccess, isFetching, isError, error} = useGetStudentListQuery({
        pageIndex,
        pageSize: PAGE_SIZE,
        usernamePrefix
    })

    let studentListUi = <h3>Init Value</h3>
    if (isFetching)
        studentListUi = <div className="bg-blue-300 dark:bg-gray-300 p-3 animated-pulse">
            <div className="flex-sm1-md2-lg3-gap-3 justify-around">
                {Array.from(Array(Math.floor(PAGE_SIZE / 2)).keys()).map((_, i) => <div key={i}
                                                                                        className={`border rounded-xl hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>

                    <div className="h-1/2 p-2 rounded-t-2xl bg-gradient-to-b from-blue-500 to-blue-200 relative">
                        <svg
                            className={'object-contain w-full h-full rounded-2xl'}
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                            fill="currentColor" viewBox="0 0 640 512">
                            <path
                                d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/>
                        </svg>

                    </div>
                    <div className="p-3 text-center">
                        <div className={'text-2xl'}>username</div>
                        <div className={'text-xl sm:text-lg'}>NN: nationalNumber</div>
                    </div>
                </div>)}
            </div>

            <PaginationWithUrlSearchParams
                pageIndex={pageIndex}
                setPage={(newPage) => null}
                hasPrev={pageIndex > 0}
                hasNext={true}
                className={'my-3'}/>
        </div>

    if (isError && !isFetching)
        studentListUi = <h3>
            <pre>
                {JSON.stringify(error, null, 4)}
            </pre>
        </h3>

    if (isSuccess && !isFetching) studentListUi = <div className="bg-blue-300 dark:bg-gray-300 p-3">
        <div className="flex-sm1-md2-lg3-gap-3 justify-around">
            {data.map(s => <AppLink to={'/Student/' + s.id} key={s.id}
                                    className={`border rounded-xl hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>
                <img
                    src={PROFILE_IMAGES_URL + s.profilePhoto}
                    alt="subjectImg"
                    className={'rounded-tr-xl rounded-tl-xl w-full'}
                />
                <div className="p-3 text-center">
                    <div className={'text-2xl'}>{s.username}</div>
                    <div className={'text-xl sm:text-lg'}>NN: {s.nationalNumber}</div>
                </div>
            </AppLink>)}
        </div>
        <PaginationWithUrlSearchParams
            pageIndex={pageIndex}
            setPage={(newPage) => updateSearchParams({page: newPage})}
            hasPrev={pageIndex > 0}
            hasNext={data.length == PAGE_SIZE}
            className={'my-3'}/>
    </div>


    return <div className={'my-container'}>

        <div className="block lg:flex flex-row-reverse">
            <div className="w-full lg:w-2/12 lg:ml-1">
                <h3 className="text-center text-2xl sm:text-xl my-3 bg-blue-500 dark:bg-gray-500">Filters</h3>
                <div className={"bg-blue-300 dark:bg-gray-300 p-3" + (isFetching ? ' animate-pulse' : '')}>
                    <div className="flex justify-around my-3">
                        <button type={'button'} onClick={_ => clearSearchParams()}>
                            Clear Search
                        </button>
                    </div>
                    <form onSubmit={e => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const d = [...formData.entries()][0]
                        //@ts-ignore
                        updateSearchParams({[d[0]]: d[1]})
                    }}>
                        {/*Has A Doctor Filter*/}
                        <div>
                            <div>
                                <label htmlFor="usernamePrefix">Name Prefix</label>
                                <input
                                    className={'block w-10/12 border text-white border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl'}
                                    name={'usernamePrefix'}
                                    id={'usernamePrefix'}
                                    placeholder={'User Name Prefix...'}
                                    defaultValue={usernamePrefix}
                                />
                            </div>
                        </div>
                        <button>Search</button>
                    </form>

                    <hr className={'my-3'}/>
                </div>
            </div>

            <div className="w-full lg:w-10/12">
                <h3 className="text-center text-2xl sm:text-xl my-3 bg-blue-500 dark:bg-gray-500">Studnets</h3>
                {studentListUi}
            </div>
        </div>
    </div>
};

export default StudentList;