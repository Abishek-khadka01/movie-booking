import { Routes, Route } from "react-router-dom";
import Login from "../pages/main/Login";
import Register from "../pages/main/Register";
import Dashboard from "../pages/main/Dashboard";
import Movies from "../pages/admin/MoviesPage";
import MovieCard from "../pages/admin/Movie";
import Shows from "../pages/main/Shows";
import ShowID from "../pages/main/Showid";

export const AppRoute = ()=>{

    return(
        
        <Routes>

            <Route path="/login" element={<Login/>}> </Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/movies" element={<Movies/>}></Route>
            <Route path="/movies/:id" element={<MovieCard/>}></Route>
            <Route path="/allshows" element={<Shows/>}></Route>
            <Route path="/shows/:showid" element={<ShowID/>}></Route>
        </Routes>



    )


}