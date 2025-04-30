import { useState } from "react"
import { UserRegisterApi } from "../../services/userApis"

const Register = ()=>{
    const [username , setUsername ] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password , setPassword] = useState<string>("")
    const [toggle ,setToggle] = useState<boolean>(false)


    async function HandleSubmit (){
        const response = await UserRegisterApi(username, email , password)

            console.log(response)
        if(response.data.data.success){
            alert(`User registered `)
        }

        

    }
    return(
        <div><h1>
            User Register
            </h1>
            
            <span> Username </span>
            <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <span>email</span>
            <input type="email" name="email" value={email }  onChange={(e)=>
                setEmail(e.target.value)
            }/>

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

            Register
            </button>


            
            </div>


    )


}

export default Register