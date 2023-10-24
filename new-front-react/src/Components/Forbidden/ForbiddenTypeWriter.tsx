import React, {useEffect, useState} from 'react';
import './Forbidden403.css'

const ForbiddenTypeWriter = ({
                                 title,
                                 text,
                                 speed = 30,
                                 time
                             }: { title: string, text: string, speed?: number, time?: number }) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        let currentIndex = 0;
        if (time) {
            speed = time * 1000 / text.length
        }
        const intervalId = setInterval(() => {
            setDisplayText(prevText => prevText + text[currentIndex]);
            currentIndex++;

            if (currentIndex === text.length) {
                setDisplayText(text)
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text]);

    return <p className={'forbidden-p'}>
        <span className={'forbidden-span'}>{title}</span>: "<i>{displayText}</i>"
    </p>;
};

export default ForbiddenTypeWriter;