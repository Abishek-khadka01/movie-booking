import { useState } from "react"
import useUserStore from "../../context/userContext"
import { UserLoginAPi } from "../../services/userApis"
import { useNavigate } from "react-router-dom"
 const Login = ()=>{

    const [email ,setEmail ] = useState<string>('')
    const [password , setPassword ] = useState<string>('')
    const [toggle , setToggle] = useState<boolean>(false)
    const {setUser} = useUserStore()
    const navigate = useNavigate()

    const HandleSubmit = async ()=>{
            try {
                const response = await UserLoginAPi(email, password)
                if(response.statusText = 'OK'){
                    const {data} = response
                    console.log(data.user)
                    alert(data.message)
                    
                    setUser({
                        profilePicture :'',
                        username : data.user.username,
                        _id : data.user._id
                    })

                    navigate("/dashboard")
                } 

            } catch (error) {
                alert(error)
            }
    }

    return (
        <>
            <div> Login</div>
            <span> Email</span>
            <input type="email" name="email"  value={ email} onChange={(e)=>{
                setEmail(e.target.value)
            }} />
            <span>Password</span>
            <input type={toggle? "text": "password"} name="password"  value={password} onChange={(e)=>{
                setPassword(e.target.value)
            }} />

            <button onClick={()=>{
                setToggle(!toggle)
            }
            }> { toggle ? "Hide Password": "Show Password "
            }</button>

            <button onClick={HandleSubmit}>

            Login
            </button>
            
            
            
        
        </>
        

    )

 }


 export default Login