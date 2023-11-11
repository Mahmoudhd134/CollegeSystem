import React, {ReactNode} from 'react';
import {useGetSubjectPageQuery} from "../../App/Api/SubjectApi";
import SubjectFileTypes from "../../App/Models/Subject/SubjectFileTypes";
import PaginationWithUrlSearchParams from "../../Components/Global/PaginationWithUrlSearchParams";
import AppLink from "../../Components/Navigation/AppLink";
import useIsInRole from "../../Hookes/useIsInRole";
import useMySearchParams from "../../Hookes/Navigation/useMySearchParams";

const SubjectList = () => {
    const {searchParams, updateSearchParams, clearSearchParams} = useMySearchParams()
    const PAGE_SIZE = 10

    const pageIndex = Number(searchParams.get('page') ?? 1) - 1

    const department = searchParams.get('department') ?? undefined
    const namePrefix = searchParams.get('namePrefix') ?? undefined
    const year = searchParams.get('year') ? +searchParams.get('year')! : undefined
    const hasDoctor = searchParams.get('hasDoctor') ? searchParams.get('hasDoctor') == 'true' : undefined
    const completed = searchParams.get('completed') ? searchParams.get('completed') == 'true' : undefined

    const isInRole = useIsInRole()
    const isAdmin = isInRole('admin')

    const {data: subjects, isFetching, isError, error} = useGetSubjectPageQuery({
        pageIndex,
        pageSize: PAGE_SIZE,
        namePrefix,
        department,
        year,
        hasDoctor,
        completed
    })

    // const updateSearchParams = (newParam: any) => {
    //     const oldParams = [...searchParams.entries()].map(o => ({
    //         [o[0]]: o[1]
    //     })).reduce((previousValue, currentValue) => previousValue = {...previousValue, ...currentValue}, {})
    //     setSearchParams(prev => ({
    //         ...prev,
    //         ...oldParams,
    //         ...newParam
    //     }))
    // }

    const maxFileTypes = Object.values(SubjectFileTypes).map(Number).filter(isNaN).length

    let subjectsContent: ReactNode = null
    if (isFetching) {
        subjectsContent = <div className="bg-blue-300 dark:bg-gray-300 p-3 animate-pulse">
            <div className="flex-sm1-md2-lg3-gap-3 justify-around">
                {Array.from(Array(Math.floor(PAGE_SIZE / 2)).keys()).map(s => <div key={s}
                                                                                   className={`border rounded-xl`}>
                    <img
                        src="/Images/subject.jpg"
                        alt="subjectImg"
                        className={'rounded-tr-xl rounded-tl-xl w-full'}
                    />
                    <div className="p-3 text-center">
                        <div className={'text-2xl h-4 bg-blue-100 rounded-xl my-1'}></div>
                        <div className={'text-xl sm:text-lg h-4 bg-blue-100 rounded-xl my-1'}></div>
                    </div>
                </div>)}
            </div>

            <PaginationWithUrlSearchParams pageIndex={pageIndex}
                                           setPage={(newPage: number) => updateSearchParams({
                                               page: newPage
                                           })}
                                           hasPrev={false}
                                           hasNext={false}
                                           className={'mt-7'}/>
        </div>
    }

    if (isError || subjects == undefined)
        subjectsContent = <h3>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </h3>

    subjectsContent = (subjects && !isFetching && !isError) ? <div className="bg-blue-300 dark:bg-gray-300 p-3">
        <div className="flex-sm1-md2-lg3-gap-3 justify-around">
            {subjects.map(s => <AppLink to={'/Subject/' + s.code} key={s.id}
                                        className={`border rounded-xl ${isAdmin ? (maxFileTypes == s.numberOfFilesTypes ? 'border-green-800' : 'border-red-800') : 'border-gray-800'} hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl transition-all`}>
                <img
                    src="/Images/subject.jpg"
                    alt="subjectImg"
                    className={'rounded-tr-xl rounded-tl-xl w-full'}
                />
                <div className="p-3 text-center">
                    <div className={'text-2xl'}>{s.department.toUpperCase()}{s.code}</div>
                    <div className={'text-xl sm:text-lg'}>{s.name}</div>
                    {isAdmin && <div className={'text-lg sm:text-md'}>{s.numberOfFilesTypes}/{maxFileTypes}</div>}
                </div>
            </AppLink>)}
        </div>

        <PaginationWithUrlSearchParams pageIndex={pageIndex}
                                       setPage={(newPage: number) => updateSearchParams({page: newPage})}
                                       hasPrev={pageIndex != 0}
                                       hasNext={(subjects?.length ?? 0) == PAGE_SIZE}
            // hasNext={true}
                                       className={'mt-7'}/>
    </div> : subjectsContent

    return (
        <div className={'my-container min-h-remaining'}>
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
                                <h3 className="text-start ml-1">Choose</h3>
                                <div>
                                    <input type={'radio'}
                                           name={'hasDoctor'}
                                           value={'true'}
                                           id={'has-doctor'}
                                           defaultChecked={hasDoctor == true}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                    />
                                    <label htmlFor="has-doctor"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}
                                    >Has a Doctor</label>
                                </div>

                                <div>
                                    <input type={'radio'}
                                           name={'hasDoctor'}
                                           value={'false'}
                                           defaultChecked={hasDoctor == false}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                           id={'not-has-doctor'}/>
                                    <label htmlFor="not-has-doctor"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}>
                                        Has No Doctor</label>
                                </div>

                                <div>
                                    <input type={'radio'}
                                           name={'hasDoctor'}
                                           value={undefined}
                                           defaultChecked={hasDoctor == undefined}
                                           className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                           id={'all-doctor-or-not'}/>
                                    <label htmlFor="all-doctor-or-not"
                                           className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}>
                                        Any</label>
                                </div>
                            </div>
                            <button>Search</button>
                        </form>

                        <hr className={'my-3'}/>
                        {isInRole('admin') &&
                            <form onSubmit={e => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const d = [...formData.entries()][0]
                                //@ts-ignore
                                updateSearchParams({[d[0]]: d[1]})
                            }}>
                                {/*A Completion Filter*/}
                                <div>
                                    <h3 className="text-start ml-1">Choose</h3>
                                    <div>
                                        <input type={'radio'}
                                               name={'completed'}
                                               value={'true'}
                                               defaultChecked={completed == true}
                                               id={'is-completed'}
                                               className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                        />
                                        <label htmlFor="is-completed"
                                               className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}
                                        >Completed</label>
                                    </div>

                                    <div>
                                        <input type={'radio'}
                                               name={'completed'}
                                               value={'false'}
                                               defaultChecked={completed == false}
                                               className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                               id={'is-not-completed'}/>
                                        <label htmlFor="is-not-completed"
                                               className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}
                                        >Not Completed</label>
                                    </div>

                                    <div>
                                        <input type={'radio'}
                                               name={'completed'}
                                               value={undefined}
                                               defaultChecked={completed == undefined}
                                               className={'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'}
                                               id={'is-completed-or-not'}/>
                                        <label htmlFor="is-completed-or-not"
                                               className={'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'}
                                        >Any</label>
                                    </div>
                                </div>
                                <button>Search</button>
                            </form>}
                        <hr className={'my-3'}/>
                        {/*Department Filter*/}

                        <form onSubmit={e => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const d = [...formData.entries()][0]
                            //@ts-ignore
                            updateSearchParams({[d[0]]: d[1]})
                        }}>
                            <div>
                                <label htmlFor="departmentName">Department Name</label>
                                <input
                                    className={'block w-10/12 border text-white border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl'}
                                    name={'department'}
                                    id={'departmentName'}
                                    placeholder={'Department...'}
                                    defaultValue={department}
                                />
                            </div>
                            <button>Search</button>
                        </form>
                        <hr className={'my-3'}/>

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
                                    name={'namePrefix'}
                                    id={'namePrefix'}
                                    placeholder={'Name Prefix...'}
                                    defaultValue={namePrefix}
                                />
                            </div>
                            <button>Search</button>
                        </form>
                        <hr className={'my-3'}/>


                        <form onSubmit={e => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const d = [...formData.entries()][0]
                            //@ts-ignore
                            updateSearchParams({[d[0]]: d[1]})
                        }}>
                            {/*Year Filter*/}
                            <div>
                                <label htmlFor="yearFilter">Year</label>
                                <input
                                    className={'block w-10/12 border text-white border-blue-500 bg-blue-50 p-2 focus:border-blue-600 focus:ring-blue-700 rounded-2xl'}
                                    name={'year'}
                                    id={'year'}
                                    placeholder={'Year(1,2,3,4,..,9)...'}
                                    defaultValue={year}
                                />
                            </div>
                            <button>Search</button>
                        </form>
                        <hr className={'my-3'}/>
                    </div>
                </div>

                <div className="w-full lg:w-10/12">
                    <h3 className="text-center text-2xl sm:text-xl my-3 bg-blue-500 dark:bg-gray-500">Subjects</h3>
                    {subjectsContent}
                </div>
            </div>
        </div>
    );
};

export default SubjectList;