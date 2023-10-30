import React from 'react';
import {useParams} from "react-router-dom";
import {useGetDoctorReportQuery} from "../../App/Api/DoctorApi";
import SubjectFileTypes from "../../Models/Subject/SubjectFileTypes";

const DoctorReport = () => {
    const {id} = useParams()
    const {data, isFetching} = useGetDoctorReportQuery(id!)

    if (isFetching) {
        const tempSubjects = []
        for (let i = 0; i < 5; i++) {
            tempSubjects.push(<div
                className={`w-[280px] sm:w-[400px] md:w-[500px] border p-4 rounded-md mb-4 shadow hover:shadow-md transition-all text-center animate-pulse`}>
                <p className="h-3 bg-gray-300 rounded-full dark:bg-gray-600"></p>
                <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 mt-2"></p>
                <div className="mt-2">
                    <h5 className="text-lg font-semibold">File Types</h5>
                    <ul>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 my-1"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 my-1"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 my-1"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 my-1"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 my-1"></p>
                    </ul>
                </div>
            </div>)
        }

        return <div className="bg-white p-4 shadow-md rounded-lg">
                <div className="text-center">
                    <div className="flex flex-col items-center gap-3 mx-auto w-full sm:w-1/2 md:w-1/3 animate-pulse">
                        <h3 className="h-4 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></h3>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-3/4"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-3/4"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-3/4"></p>
                        <p className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-3/3"></p>
                        <p className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full mt-2"></p>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-2xl text-center font-semibold mb-2">Subjects</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {tempSubjects.map((x,i) => <div key={i}>{x}</div>)}
                        </div>
                    </div>
                </div>
            </div>
    }

    if (data == undefined)
        return <h3>Error...</h3>
    return (
        // <div className={'my-container min-h-remaining'}>
            <div className="dark:bg-gray-100 p-4 shadow-md rounded-lg">
                <div className="flex">
                    <div className="ml-auto">
                        <button className={'h-16 w-32 rounded-xl hovel:cursor-pointer bg-blue-100 focus:bg-blue-200 dark:bg-gray-100 dark:focus:bg-gray-200 transition-all no-print'}
                                onClick={_ => window.print()}
                        >Print</button>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">
                        {data.firstname} {data.lastname}
                    </h2>
                    <p className="text-gray-600">@{data.username}</p>
                    <p className="text-gray-600">{data.email}</p>
                    <p className="text-gray-600">Phone Number: {data.phoneNumber}</p>
                    <p className="text-gray-600">National Number: {data.nationalNumber}</p>

                    <p className={`mt-4 text-xl font-semibold ${data.isComplete ? 'text-green-600' : 'text-red-600'}`}>
                        {data.isComplete ? 'Files is complete' : 'Files is not complete'}
                    </p>
                </div>

                <div className="mt-4">
                    <h3 className="text-2xl text-center font-semibold mb-2">Subjects</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {data.subjects.map((subject) => (
                            <div key={subject.id}
                                 className={`border ${subject.unCompletedTypes.length > 0 ? 'border-red-600' : 'border-green-600'} p-4 rounded-md mb-4 shadow hover:shadow-md transition-all text-center`}>
                                <h4 className="text-xl font-semibold">{subject.name}, {subject.code}</h4>
                                <p className="text-gray-600">Department: {subject.department}</p>

                                <div className="mt-2">
                                    <h5 className="text-lg font-semibold">File Types</h5>
                                    <ul>
                                        {subject.completedTypes.map((type, typeIndex) => (
                                            <li key={typeIndex} className="text-green-600">
                                                {SubjectFileTypes[type]} - Completed
                                            </li>
                                        ))}
                                        {subject.unCompletedTypes.map((type, typeIndex) => (
                                            <li key={typeIndex} className="text-red-600">
                                                {SubjectFileTypes[type]} - Not Completed
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        // </div>
    );
};

export default DoctorReport;