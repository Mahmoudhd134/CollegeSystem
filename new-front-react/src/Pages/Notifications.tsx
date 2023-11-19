import useAppSelector from "../Hookes/useAppSelector";
import {PROFILE_IMAGES_URL} from "../App/Api/axiosApi";
import AppLink from "../Components/Navigation/AppLink";
import TimeAgo from "../Components/Global/TimeAgo";

const Notifications = () => {
    const notifications = useAppSelector(s => s.app.messageNotification)
    return <div className={'my-container'}>
        <div className="flex flex-col gap-3">
            {notifications.map((n, i) => <div key={i} className="border rounded-xl p-3">
                <img src={PROFILE_IMAGES_URL + n.sender.image} alt="sender_image"
                     className="h-12 w-12 rounded-full object-cover inline mr-3"/>
                {n.sender.userName}
                <hr className={'my-3'}/>
                <div>
                    subject: <AppLink to={'/Subject/' + n.subjectCode}>{n.subjectName}</AppLink>
                </div>
                <div>
                    room: <AppLink to={'/Room/' + n.roomId}>{n.roomName}</AppLink>
                </div>
                <div>
                    {n.first100Char}
                </div>
                <div>
                    <TimeAgo timestamp={n.date as unknown as string}/>
                </div>
            </div>)}
        </div>
    </div>
};

export default Notifications;