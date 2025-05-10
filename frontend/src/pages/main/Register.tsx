import { useState, useEffect } from "react";
import { UserRegisterApi } from "../../services/userApis";
import { Eye, EyeOff } from "lucide-react"; // Importing icons for show/hide password
import useUserStore from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [togglePassword, setTogglePassword] = useState<boolean>(false);  // Toggle for Password visibility
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState<boolean>(false); // Toggle for Confirm Password visibility
  
  const [error, setError] = useState<string>("");
const navigate = useNavigate()
  async function handleSubmit() {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await UserRegisterApi(username, email, password);

      if (response.data.data.success) {
        alert("User registered successfully!");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during registration.");
    }
  }


  useEffect(()=>{
    if(useUserStore.getState().user?.isLogin){
      navigate("/dashboard")
    }


  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:w-96 max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-600">User Registration</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Username Input */}
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your username"
          />
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type={togglePassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setTogglePassword(!togglePassword)}
          >
            {togglePassword ? (
              <EyeOff className="text-gray-600" />
            ) : (
              <Eye className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6 relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type={toggleConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
          >
            {toggleConfirmPassword ? (
              <EyeOff className="text-gray-600" />
            ) : (
              <Eye className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
