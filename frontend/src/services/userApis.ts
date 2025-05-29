import axios from "axios"



 export const UserRegisterApi = async (username : string  , email : string  , password : string  )=>{

    return await axios.post(import.meta.env.VITE_USER_REGISTER , {
        username,
        email,
        password
    }, {
        withCredentials : true
    })

}



export const UserLoginAPi = async (email : string , password : string)=>{
    console.log(import.meta.env.VITE_USER_LOGIN)
    return await axios.post(import.meta.env.VITE_USER_LOGIN, {
        email,
        password
    }, {
        withCredentials  : true
    })
}



export const UserLogOut = async ()=>{
    console.log(`User LogOut clicked `)
    return await axios.put(import.meta.env.VITE_USER_LOGOUT , {
        
    }, {
        withCredentials : true
    })
}

export const FindUsers = async (email : string )=>{
     
    console.log(`${import.meta.env.VITE_USER_FIND}/${email}`)
    return await axios.get(`${import.meta.env.VITE_USER_FIND}/${email}`, {
        withCredentials : true
    } )
}

export const FindAdmins = async ()=>{
    return await axios.get(import.meta.env.VITE_ADMIN_FIND, {
        withCredentials : true
    })
}