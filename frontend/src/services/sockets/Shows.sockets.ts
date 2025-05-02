import { Socket , io} from "socket.io-client";

class ShowsSocket  {

    private static SocketInstance : Socket | null = null
        

        static Instance = ()=>{
            return this.SocketInstance
        }
        static GetInstance = (userid : string, showid : string )=>{
            console.log(userid)
           if(!this.SocketInstance){
            this.SocketInstance = io("http://localhost:4000/shows", {
                auth :{
                    userId : userid ,
                    showId : showid
                }
                
            })
           }

           return this.SocketInstance
        }


        static EmitEvent = (eventName : string , message : any)=>{
            console.log(`Emit event is running${eventName} ${message} `)
            this.SocketInstance?.emit(eventName, message)
        }

        static ConnectSocket = (userid : string, showid : string  )=>{
            console.log(`Connect Socket is running `)
            return this.GetInstance(userid, showid)
        }



}





export default ShowsSocket