import axios from "axios"




 export const FindShowbyID = async(showid : string )=>{
    return await axios.get(`${import.meta.env.VITE_USERS_SPECIFIC_SHOWS}/${showid}`, {
        withCredentials : true,
     
    })
}


export const FindShows = async ()=>{
    console.log(`${import.meta.env.VITE_USERS_SPECIFIC_SHOWS}`)
    return await axios.get(`${import.meta.env.VITE_USERS_SPECIFIC_SHOWS}`, {
        withCredentials : true
    })


}