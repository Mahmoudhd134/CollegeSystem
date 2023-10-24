import React, {SetStateAction} from "react";

const Pagination = ({
                        page,
                        setPage,
                        hasNext,
                        className = ''
                    }: { page: number, setPage: React.Dispatch<SetStateAction<number>>, hasNext: boolean, className?: string }) => {
    return (
        <footer className={'container'}>
            <nav className={`row justify-content-center align-items-baseline ${className}`}
                 onMouseMove={e => e.preventDefault()}
                 onMouseDown={e => e.preventDefault()}
            >
                <ul className="pagination col-10 col-sm-8 col-md-6 justify-content-center">
                    <li className={`page-item ${page == 0 && 'disabled'}`}>
                        <button className={'page-link'} onClick={e => setPage(p => p - 1)}>dec</button>
                    </li>
                    <li className="page-item">
                        <button className={`page-link ${page == 0 && 'disabled'}`}
                                onClick={e => setPage(p => p - 1)}
                        >{page}</button>
                    </li>
                    <li className="page-item active" aria-current="page">
                        <button className="page-link">{page + 1}</button>
                    </li>
                    <li className="page-item">
                        <button className={`page-link ${hasNext && 'disabled'}`}
                                onClick={e => setPage(p => p + 1)}
                        >{page + 2}</button>
                    </li>
                    <li className={`page-item ${hasNext && 'disabled'}`}>
                        <button className={'page-link'} onClick={e => setPage(p => p + 1)}>inc</button>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Pagination;