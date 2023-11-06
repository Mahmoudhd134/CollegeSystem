import {useSearchParams} from "react-router-dom";

const UseMySearchParams = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const updateSearchParams = (newParam: any) => {
        const oldParams = [...searchParams.entries()].map(o => ({
            [o[0]]: o[1]
        })).reduce((previousValue, currentValue) => previousValue = {...previousValue, ...currentValue}, {})
        setSearchParams(prev => ({
            ...prev,
            ...oldParams,
            ...newParam
        }))
    }

    const clearSearchParams = () => {
        setSearchParams({})
    }

    return {
        searchParams,
        updateSearchParams,
        clearSearchParams
    }
};

export default UseMySearchParams;