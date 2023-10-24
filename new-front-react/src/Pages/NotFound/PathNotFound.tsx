import {useLocation} from "react-router-dom";

const PathNotFound = () => {
    const loc = useLocation()

    return (<div className={'min-h-remaining bg-blue-800 flex flex-col justify-center items-center text-blue-200'}>
        <div className="w-full sm:w-3/4 md:w-1/2 xl:w-1/3 text-center">
            <h1 className={'text-4xl'}>404</h1>
            <h3 className={'text-2xl my-2'}>The page you are trying to reach '{loc.pathname}' is not found</h3>
        </div>
    </div>)
}

export default PathNotFound