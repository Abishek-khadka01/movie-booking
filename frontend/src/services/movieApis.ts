import axios from "axios"



export const FindAllMovies = async ()=>{
    console.log(`Find Movies running  ${import.meta.env.VITE_MOVIES_FIND}`)
    return await axios.get(import.meta.env.VITE_MOVIES_FIND, {
        withCredentials : true
    })

}

export const GetMoviebyId = async (id : string )=>{
    
    console.log(`${import.meta.env.VITE_FIND_MOVIE_BYID}/${id}`)
    return axios.get(`${import.meta.env.VITE_FIND_MOVIE_BYID}/${id}`, {
       withCredentials : true
    })
}