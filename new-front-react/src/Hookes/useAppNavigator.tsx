import {useLocation, useNavigate} from "react-router-dom"

const useAppNavigator = () => {
    const navigator = useNavigate()
    const loc = useLocation()

    return (path: string) => navigator(path, {state: {from: loc}})
}

export default useAppNavigator