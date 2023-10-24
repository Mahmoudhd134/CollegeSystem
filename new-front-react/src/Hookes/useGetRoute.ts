import {useLocation} from "react-router-dom";

const UseGetRoute = () => {
    const loc = useLocation().pathname.split('/')
    return loc[loc.length - 1]
};

export default UseGetRoute;