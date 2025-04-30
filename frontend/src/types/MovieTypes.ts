
export type MovieResponseType = {
    _id : string 
    title: string
    
         thumbnail :string
    
      
      releaseDate: Date
     
  


}

export interface FullMovieResponse extends MovieResponseType {

    description : string ,
    duration : number,
    language : string,
    genre : string[]
    rating : number,
    
}