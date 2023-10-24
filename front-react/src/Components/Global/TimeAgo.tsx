import React from 'react';
import {formatDistanceToNow} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz'

const TimeAgo = ({timestamp, className = ''}: { timestamp: string, className?: string }) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const zonedDate = utcToZonedTime(timestamp, timeZone)
    const timeFromNow = formatDistanceToNow(zonedDate)
    const timeAgo = timeFromNow + ' ago'
    return (
        <span title={timestamp} className={className}>
            <i>{timeAgo}</i>
        </span>
    );
};

export default TimeAgo;