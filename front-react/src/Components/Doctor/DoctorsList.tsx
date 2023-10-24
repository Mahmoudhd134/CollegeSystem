import React, {useRef, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {useDeleteDoctorMutation, useGetDoctorPageQuery} from '../../App/Api/DoctorApi'
import {Alert} from 'react-bootstrap'
import useGetAppError from '../../Hookes/useGetAppError'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faTrash, faX} from '@fortawesome/free-solid-svg-icons'
import Pagination from "../Pagination";
import './DoctorList.scss'
import {BASE_URL} from "../../App/Api/BaseApi";

const PAGE_SIZE = 10
const DoctorsList = () => {
    const {pageIndex} = useParams()
    const [page, setPage] = useState(Number(pageIndex ?? '0'))
    const [usernamePrefix, setUsernamePrefix] = useState('')
    const loc = useLocation()
    const name = useRef() as React.MutableRefObject<HTMLInputElement>
    const [idToRevmoe, setIdToRemove] = useState<string | null>(null)
    const twoStepRemoveScreen = useRef() as React.MutableRefObject<HTMLDivElement>
    const [filterHasSubject, setFilterHasSubject] = useState<boolean | null>(null)


    const {data, isError, error} =
        useGetDoctorPageQuery({pageIndex: page, pageSize: PAGE_SIZE, usernamePrefix, hasSubject: filterHasSubject})

    const [remove, removeResult] = useDeleteDoctorMutation()


    const removeHandlerOne = (id: string) => {
        return (e: React.MouseEvent) => {
            e.preventDefault()
            setIdToRemove(id)
            window.scroll({top: 0, behavior: 'smooth'})
        }
    }

    const removeHandlerTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        remove(idToRevmoe!)
        setIdToRemove(null)
    }

    const returnBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIdToRemove(null)
    }
    const selectHasSubjectOrNot = (className?: string) => {
        return <div className={"btn-group " + className ?? ''}>
            <button type="button" className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                {filterHasSubject == null ? 'All' : filterHasSubject ? 'Has Subjects' : 'Has No Subjects'}
            </button>
            <ul className="dropdown-menu w-75">
                <li onClick={e => setFilterHasSubject(null)}>
                    <div className="dropdown-item">All</div>
                </li>
                <li onClick={e => setFilterHasSubject(true)}>
                    <div className="dropdown-item">Has Subject</div>
                </li>
                <li onClick={e => setFilterHasSubject(false)}>
                    <div className="dropdown-item">Has No Subject</div>
                </li>
            </ul>
        </div>
    }


    return (
        <div style={{background: '#F5F5F5'}} className={'p-3'}>
            <div className='container'>
                {isError && <Alert variant='danger'>{useGetAppError(error)?.message}</Alert>}

                {idToRevmoe && <div ref={twoStepRemoveScreen}
                                    className='border border-3 roudned rounded-3 mx-auto p-3'>
                    <h3 className='text-center'>Are You Sure You Want To
                        Delete {data?.filter(d => d.id == idToRevmoe)[0].username}</h3>
                    <div className="row justify-content-center gap-4">
                        <div className="col-4">
                            <button onClick={removeHandlerTwo} className='btn btn-outline-danger'>Remove Any Way
                            </button>
                        </div>

                        <div className="col-4">
                            <button onClick={returnBack} className='btn btn-outline-primary'>Return Back</button>
                        </div>
                    </div>
                </div>}
                <h3 className='txt'>
                    <img src='/images/doctor.png'
                         style={{width: '60px', height: '60px', borderRadius: '50%', margin: '15px'}}></img>Doctors
                </h3>


                <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">@</span>
                    <input type="text" className="form-control" placeholder="Username Prefix" aria-label="Username"
                           aria-describedby="addon-wrapping"
                           ref={name}/>
                    <button className="btn bg-white ms-n3" style={{margin: '1px'}} type="button" onClick={e => {
                        setUsernamePrefix(name.current.value)
                        setPage(0)
                    }}>
                        <img src='/images/search.png'
                             style={{width: '30px', height: '30px', borderRadius: '50%'}}></img>
                    </button>
                    <div className="row justify-content-center">
                        {selectHasSubjectOrNot('col-12 col-sm-8 col-md-6 col-lg-6')}
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col-8 col-md-2'>
                        <Link className='btn btn-outline-dark w-100 my-3' to={'/doctor/add'} state={{from: loc}}>
                            <img src='/images/add.png' style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }}></img> Add Doctor

                        </Link>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {data?.map(d =>
                        <div className="col-sm-6 col-lg-4 mb-4">
                            <div className="candidate-list candidate-grid">
                                <div className="candidate-list-image">
                                    <img className="img-thumbnail"
                                         src={BASE_URL.slice(0, BASE_URL.length - 5) + '/profileImages/' + d.profilePhoto}
                                         alt=""/>
                                </div>
                                <div className="candidate-list-details">
                                    <div className="candidate-list-info">
                                        <div className="candidate-list-title">
                                            <h5><Link to={'/doctor/' + d.id} state={{from: loc}}>{d.username}</Link>
                                            </h5>
                                        </div>
                                        <div className="candidate-list-option">
                                            <ul className="list-unstyled">
                                                <li>NN: {d.nationalNumber}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="candidate-list-favourite-time">
                                            <span className="candidate-list-favourite order-2 ms-auto"
                                                  onClick={removeHandlerOne(d.id)} style={{cursor: "pointer"}}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </span>
                                        <span className="candidate-list-time order-1">
                                                {d.isComplete ?
                                                    <span className={'text-primary'}><FontAwesomeIcon icon={faCheck}/> Complete</span> :
                                                    <span className={'text-danger'}><FontAwesomeIcon icon={faX}/> Not Complete</span>}
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
            <Pagination page={page}
                        setPage={setPage}
                        hasNext={(data?.length ?? 0) == 0 || (data?.length ?? 0) < PAGE_SIZE}
                        className={'my-3'}
            />
        </div>
    )
}

export default DoctorsList