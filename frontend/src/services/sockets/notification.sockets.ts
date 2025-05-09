import { Socket , io} from "socket.io-client";

class NotificationSocket  {

    private static SocketInstance : Socket | null = null
        
        static GetInstance = (userid : string)=>{
            console.log(userid)
           if(!this.SocketInstance){
            this.SocketInstance = io("http://localhost:4000/notifications", {
                auth :{
                    userId : userid ,
                }
                
            })
           }

           return this.SocketInstance
        }


        static EmitEvent = (eventName : string , message : any)=>{
            this.SocketInstance?.emit(eventName, message)
        }

        static ConnectSocket = (userid : string )=>{
            console.log(`Connect Socket is running `)
            return this.GetInstance(userid)
        }


        static DisConnect = ()=>{
            this.SocketInstance?.disconnect()
        }



}





export default NotificationSocket