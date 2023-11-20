import React, {useEffect, useState} from 'react';

const useScreenDimensions = () => {
    const [height, setHeight] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    useEffect(() => {
        const handle = () => {
            setHeight({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        window.addEventListener('resize', handle)
        return () => window.removeEventListener('resize', handle)
    }, [])

    return height
};

export default useScreenDimensions;