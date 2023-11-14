import {useDeleteDoctorMutation, useGetDoctorPageQuery} from "../../App/Api/DoctorApi"
import React, {useEffect, useState} from "react";
import getAppError from "../../Utilites/getAppError";
import {BASE_URL} from "../../App/Api/axiosApi";
import useAppNavigator from "../../Hookes/Navigation/useAppNavigator";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../Components/Global/Pagination";
import './doctor.css'
import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";
import PaginationWithUrlSearchParams from "../../Components/Global/PaginationWithUrlSearchParams";

const PAGE_SIZE = 10
const DoctorList = () => {
    const {searchParams, updateSearchParams, clearSearchParams} = useMySearchParams()
    const pageIndex = +(searchParams.get('page') ?? 1) - 1
    const usernamePrefix = searchParams.get('usernamePrefix') ?? undefined
    const hasSubject = searchParams.get('hasSubject') ? searchParams.get('hasSubject') == 'true' : undefined
    const [remove, removeResult] = useDeleteDoctorMutation()
    const [id, setId] = useState<string | null>(null)
    const {data, isError, error, isFetching} = useGetDoctorPageQuery({
        pageSize: PAGE_SIZE,
        pageIndex,
        usernamePrefix,
        hasSubject
    })
    const navigator = useAppNavigator()

    useEffect(() => {
        if (removeResult.isSuccess)
            setId(null)
    }, [removeResult.isSuccess])


    const spinner =
        <svg aria-hidden="true"
             className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
        </svg>

    const doctors = data && <div className={'bg-blue-300 dark:bg-gray-300 p-3'}>
        <div className="flex-sm1-md2-lg3-gap-3 justify-around items-center my-3 w-full">
            {data.map(d => <div key={d.id}
                                className={`border-4 ${d.isComplete ? 'border-green-500' : 'border-red-500'} h-80 rounded-2xl bg-blue-50`}>
                <div className="h-1/2 p-2 rounded-t-2xl bg-gradient-to-b from-blue-500 to-blue-200">
                    <img
                        className={'object-contain w-full h-full rounded-2xl'}
                        src={BASE_URL.slice(0, BASE_URL.length - 4) + '/profileImages/' + d.profilePhoto} alt=""/>
                </div>
                <div className="h-1/4 p-2 text-center bg-gradient-to-b from-blue-200 to-blue-100">
                    <h1 className={'text-3xl sm:text-2xl overflow-hidden'}>{d.username}</h1>
                    <h3 className="text-md sm:text-sm">NN: <b>{d.nationalNumber}</b></h3>
                </div>
                <div className="h-1/4 flex bg-gradient-to-r from-blue-200 to-red-200 rounded-b-2xl">
                    <button
                        onClick={e => navigator('/Doctor/' + d.id)}
                        className="doctor-list-card-more-button">More
                    </button>
                    <button
                        onClick={e => setId(d.id)}
                        className="doctor-list-card-remove-button">Remove
                    </button>
                </div>
            </div>)}
        </div>
        <PaginationWithUrlSearchParams
            pageIndex={pageIndex}
            setPage={(newPage => updateSearchParams({page: newPage}))}
            hasPrev={pageIndex > 0}
            hasNext={data?.length == PAGE_SIZE}
            className={'my-3'}
        />
    </div>

    const removeDoctor = <div
        className={'doctor-list-remove-doctor-window'}
        onClick={e => setId(null)}>
        <div
            className="doctor-list-remove-doctor-inner-window">
            <div className="absolute top-0 right-0 -translate-x-1 translate-y-1">
                <FontAwesomeIcon icon={faX} className={'hover:cursor-pointer'}/>
            </div>
            <h3>Are you sure you want to delete doctor '{data?.find(x => x.id == id)?.username}' ?</h3>


            <div className="h-1/4 flex bg-gradient-to-r from-blue-200 to-red-200 rounded-xl w-3/4">
                <button
                    onClick={e => setId(null)}
                    className="doctor-list-remove-card-return-back-button">
                    Return Back
                </button>
                <button
                    onClick={e => {
                        e.stopPropagation()
                        remove(id!)
                    }}
                    disabled={removeResult.isLoading}
                    className="doctor-list-remove-card-remove-button">
                    {removeResult.isLoading ? spinner : 'Remove'}
                </button>
            </div>
        </div>
    </div>

    const skeleton = isFetching && <div className={'bg-blue-300 dark:bg-gray-300 p-3'}>
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-3 w-full animate-pulse">
            {Array.from(Array(Math.floor(PAGE_SIZE / 2)).keys()).map(i => <div key={i}
                                                                               className="border border-blue-500 h-80 rounded-2xl bg-blue-50">
                <div className="h-1/2 p-2 rounded-t-2xl bg-gradient-to-b from-blue-500 to-blue-200 relative">
                    <svg
                        className={'object-contain w-full h-full rounded-2xl'}
                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                        fill="currentColor" viewBox="0 0 640 512">
                        <path
                            d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/>
                    </svg>

                </div>
                <div className="h-1/4 p-2 text-center bg-gradient-to-b from-blue-200 to-blue-100">
                    <h1 className={'text-3xl sm:text-2xl overflow-hidden h-4'}></h1>
                    <h3 className="text-md sm:text-sm h-4"><b></b></h3>
                </div>
                <div className="h-1/4 flex bg-gradient-to-r from-blue-200 to-red-200 rounded-b-2xl">
                    <button
                        className="doctor-list-card-more-button">More
                    </button>
                    <button
                        className="doctor-list-card-remove-button">Remove
                    </button>
                </div>
            </div>)}
        </div>
        <PaginationWithUrlSearchParams pageIndex={0}
                                       setPage={(n) => undefined}
                                       hasPrev={false} hasNext={false}
                                       className={'my-3'}/>
    </div>


    if (isError)
        return <h3>Error {getAppError(error)?.message}</h3>

    return (
        <div className={'my-container min-h-remaining'}>
            {id && removeDoctor}
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
                            {/*Has A Subject*/}
                            <div>
                                <h3 className="text-start ml-1">Choose</h3>
                                <div>
                                    <input type={'radio'}
                                           name={'hasSubject'}
                                           value={'true'}
                                           id={'has-subject'}
                                           defaultChecked={hasSubject == true}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                    />
                                    <label htmlFor="has-subject"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}
                                    >Has a Subject</label>
                                </div>

                                <div>
                                    <input type={'radio'}
                                           name={'hasSubject'}
                                           value={'false'}
                                           defaultChecked={hasSubject == false}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                           id={'not-has-subject'}/>
                                    <label htmlFor="not-has-subject"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}>
                                        Has No Subject</label>
                                </div>

                                <div>
                                    <input type={'radio'}
                                           name={'hasSubject'}
                                           value={undefined}
                                           defaultChecked={hasSubject == undefined}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                           id={'has-subject-or-not'}/>
                                    <label htmlFor="has-subject-or-not"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}>
                                        Any</label>
                                </div>
                            </div>
                            <button>Search</button>
                        </form>
                        <br/>
                        <hr/>
                        <br/>
                        <form onSubmit={e => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const d = [...formData.entries()][0]
                            //@ts-ignore
                            updateSearchParams({[d[0]]: d[1]})
                        }}>
                            {/*Name Prefix Filter*/}
                            <div>
                                <label htmlFor="namePrefix">Name Prefix</label>
                                <input
                                    className={'block w-10/12 border text-white border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl'}
                                    name={'usernamePrefix'}
                                    id={'namePrefix'}
                                    placeholder={'Name Prefix...'}
                                    defaultValue={usernamePrefix}
                                />
                            </div>
                            <button>Search</button>
                        </form>
                        <hr className={'my-3'}/>
                    </div>
                </div>

                <div className="w-full lg:w-10/12">
                    <h3 className="text-center text-2xl sm:text-xl my-3 bg-blue-500 dark:bg-gray-500">Doctors</h3>
                    {isFetching ? skeleton : doctors}
                </div>
            </div>
        </div>
    )
}

export default DoctorList