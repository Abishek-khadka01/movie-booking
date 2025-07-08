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