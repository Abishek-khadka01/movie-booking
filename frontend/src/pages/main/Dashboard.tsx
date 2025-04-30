import { useEffect } from "react"
import NotificationSocket from "../../services/sockets/notification.sockets"
import useUserStore from "../../context/userContext"
const Dashboard = ()=>{
    const {user} = useUserStore.getState()
    console.log(user)
    useEffect(()=>{
        NotificationSocket.ConnectSocket(user?._id as string)
    }, [])

    return (<>
    <h2>Dashboard</h2>
        {
            <div>
                <span>id </span>
                <h2> {user?._id}</h2>
                <span> Username </span>
                <h2> {user?.username}</h2>
                <span> Profile Picture</span>
                <img src={user?.profilePicture } alt="" />

            </div>
        }

        </>
    )


}



export default Dashboard