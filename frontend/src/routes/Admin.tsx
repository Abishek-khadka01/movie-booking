
import { Outlet } from "react-router-dom"; // For nested routes
import useUserStore from "../context/userContext"; // Zustand store
// Landing page for non-logged-in users
import Navbar from "../pages/main/Navbar"; // Navbar for both logged-in and non-logged-in users
import Login from "../pages/main/Login";

const AdminRoute = () => {
  
  const isLogin = useUserStore.getState().user?.isLogin ;
    const isAdmin = useUserStore.getState().user?.admin
  return (
    <div className="min-h-screen flex flex-col">
      {/* Always render Navbar */}
      <Navbar />
      
      {/* Conditionally render either Outlet or LandingPage */}
      <div className="flex-1">
        {isLogin && isAdmin? (
          <Outlet /> // Render child routes (Dashboard, Movies, etc.) if logged in
        ) : (
          <Login /> // Render LandingPage if not logged in
        )}
      </div>
    </div>
  );
};

export default AdminRoute;
