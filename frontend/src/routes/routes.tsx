import { Routes, Route } from "react-router-dom";
import Login from "../pages/main/Login";
import Register from "../pages/main/Register";
import Dashboard from "../pages/main/Dashboard";
import Movies from "../pages/admin/MoviesPage";
import MovieCard from "../pages/admin/Movie";
import Shows from "../pages/main/Shows";
import ShowID from "../pages/main/Showid";
import PaymentCallback from "../pages/main/PaymentCallback";
import NavRoute from "./NavRoute"; // This will have Navbar and Outlet management
// Navbar component for global use
import LandingPage from "../LandingPage"; // For non-logged-in users
import LoginFalseNavRoute from "./NonLogin";

export const AppRoute = () => {
  return (
    <Routes>
      {/* Routes for non-logged-in users, Navbar is always rendered here */}
      <Route path="/" element={ <LoginFalseNavRoute /> }>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/allshows" element={<Shows />} /> 
      </Route>

      {/* Authenticated routes with Navbar and Outlet */}
      <Route path="/" element={<NavRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies/:id" element={<MovieCard />} />
        <Route path="/shows/:showid" element={<ShowID />} />
        <Route path="/khalti/callback" element={<PaymentCallback />} />
      </Route>
    </Routes>
  );
};
