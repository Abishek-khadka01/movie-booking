import { Outlet } from "react-router-dom"; // For nested routes
import Navbar from "../pages/main/Navbar"; // Navbar for both logged-in and non-logged-in users

const LoginFalseNavRoute = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Always render Navbar */}
      <Navbar />
      
      {/* Add a gap here between the Navbar and the content below */}
      <div className="flex-1 mt-10"> {/* Adjust the mt-10 value to control the gap */}
        <Outlet />
      </div>
    </div>
  );
};

export default LoginFalseNavRoute;
