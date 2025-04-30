class ApiError extends Error{
    private statusCode : number
    private errorMessage : string 
    constructor(statuscode : number , errormessage : string){
        super()
        this.statusCode = statuscode,
        this.errorMessage = errormessage,
        this.message = this.message
    }

    


}

export default ApiError