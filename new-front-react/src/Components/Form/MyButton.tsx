import {ReactNode} from "react";

type Props = {
    children: ReactNode,
    className?: string,
    type: "button" | "submit" | "reset" | undefined
}
export const MyButton = ({type = 'button', children, className = ''}: Props) => {
    return (
        <button
            className={'bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 border border-blue-600 rounded-2xl p-3 transition-all hover:shadow-xl hover:shadow-blue-200 ' + className}
            type={type}
        >
            {children}
        </button>
    );
};