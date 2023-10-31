import useAppSelector from "./useAppSelector";

const UseIsInRole = () => {
    const roles = useAppSelector(s => s.auth.roles)
    return (role: string): boolean => roles?.some(r => r.toLowerCase() == role.toLowerCase()) ?? false
};

export default UseIsInRole;