import { JwtPayload } from "jsonwebtoken";

export interface JwtResponseType extends JwtPayload{
    _id : string 
}