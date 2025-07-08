
export type MovieResponseType = {
    _id : string 
    title: string
    
         thumbnail :string
        rating : number
      
      releaseDate: Date
     
  


}

export interface FullMovieResponse extends MovieResponseType {

    description : string ,
    duration : number,
    language : string,
    genre : string[]
   
    
}