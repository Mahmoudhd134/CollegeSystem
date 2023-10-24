import React from 'react';
import './Forbidden403.css'
import ForbiddenTypeWriter from "./ForbiddenTypeWriter";

const Forbidden403 = ({errors}: { errors: { title: string, text: string }[] }) => {
    return (
        <div className="forbidden mt-5">
            <div className="bg"></div>
            <div className={'forbidden-container'}>
                <h1 className={'forbidden-h1'}>403</h1>
                <div className={'container forbidden-div'}>
                    {errors.map((e, i) =>
                        <ForbiddenTypeWriter key={i} title={e.title} text={e.text} time={2}/>)}
                </div>
            </div>
        </div>
    );

};

export default Forbidden403;