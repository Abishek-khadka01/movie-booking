import axios from "axios"




 export const FindShowbyID = async(showid : string )=>{
    return await axios.get(`${import.meta.env.VITE_USERS_SPECIFIC_SHOWS}/${showid}`, {
        withCredentials : true,
     
    })
}


export const FindShows = async ()=>{
    return await axios.get(`${import.meta.env.VITE_USER_SPECIFIC_SHOWS}`, {
        withCredentials : true
    })


}