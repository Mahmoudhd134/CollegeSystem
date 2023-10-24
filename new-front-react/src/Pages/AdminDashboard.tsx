import {Link, useLocation} from "react-router-dom";

const AdminDashboard = () => {
    const loc = useLocation()

    const linkClasses = 'w-5/12 bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 rounded-xl h-12 flex justify-center items-center transition-all'

    return (<div className={'container mx-auto p-4'}>
        <div className="flex flex-wrap justify-evenly gap-2">
            <div
                className="border border-blue-700 p-5 w-full sm:w-5/12 rounded-xl bg-blue-200 hover:shadow hover:shadow-blue-200">
                <h3 className="text-center text-blue-800 text-3xl sm:text-2xl">Doctors!</h3>
                <div className="flex justify-between mt-3">
                    <Link to={'/Doctor/List'} state={{from: loc}} className={linkClasses}> Doctors List</Link>
                    <Link to={'/Doctor/Add'} state={{from: loc}} className={linkClasses}> Add New</Link>
                </div>
            </div>

            <div
                className="border border-blue-700 p-5 w-full sm:w-5/12 rounded-xl bg-blue-200 hover:shadow hover:shadow-blue-200">
                <h3 className="text-center text-blue-800 text-3xl sm:text-2xl">Subjects!</h3>
                <div className="flex justify-between mt-3">
                    <Link to={'/'} state={{from: loc}} className={linkClasses}> Subjects List</Link>
                    <Link to={'/'} state={{from: loc}} className={linkClasses}> Add New</Link>
                </div>
            </div>
        </div>
    </div>)
}

export default AdminDashboard