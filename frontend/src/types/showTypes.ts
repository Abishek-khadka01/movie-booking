export type ShowDetailsType =  {

    movie:{
        title : string,
        description : string,
        rating :  number,
        _id : string 
    },
    screen :{
        _id : string ,
        name : string 
    },
    seats : SeatType[]

}



type SeatType = {
    seatNumber : string ,
    _id : string ,
    price : Number,
    status : 'AVAILABLE'| 'BOOKED'|  'BLOCKED'
}



 export type ShowType = {
    _id : string ,
    movie :{
        _id : string ,
        thumbnail : string,
        title : string,
    },
    screen :{
        name : string ,
        _id : string 
        
    }
}
