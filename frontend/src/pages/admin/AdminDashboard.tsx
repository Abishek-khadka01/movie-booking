import { useState, useEffect } from "react";
import { FindAllMovies } from "../../services/movieApis";
import { FindUsers, FindAdmins } from "../../services/userApis";
import { FindShows } from "../../services/showApis";
import { Eye, Trash2, PlusCircle, ShieldCheck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
type MovieType = {
  _id: string;
  title: string;
  thumbnail: string;
};

type ShowType = {
  _id: string;
  startTime: string;
  endTime: string;
  movie: MovieType;
  screen: {
    _id: string;
    name: string;
  };
};

type TypeUsers = {
  _id: string;
  email: string;
  profilePicture: string;
  admin: boolean;
};

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<TypeUsers[]>([]);
  const [users, setUsers] = useState<TypeUsers[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<TypeUsers[]>([]);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [shows, setShows] = useState<ShowType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const handleNewMovie = () => {
    alert("New movie clicked");
  };

  const handleViewShow = (id: string) => {
    
    alert(`View show with ID: ${id}`);
    navigate(`/shows/${id}`)
  };

  const handleDeleteShow = (id: string) => {
    setShows((prev) => prev.filter((show) => show._id !== id));
  };

  const handleMakeAdmin = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, admin: true } : user
    );
    setUsers(updatedUsers);

    const newAdmin = updatedUsers.find((user) => user._id === userId);
    if (newAdmin && !admins.some((admin) => admin._id === newAdmin._id)) {
      setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
    }

    const updatedFiltered = filteredUsers.map((user) =>
      user._id === userId ? { ...user, admin: true } : user
    );
    setFilteredUsers(updatedFiltered);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const localFiltered = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (localFiltered.length === 0) {
      try {
        const result = await FindUsers(searchTerm);
        if (result && result.data.success) {
          setFilteredUsers([result.data.message]);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Search error", error);
        setFilteredUsers([]);
      }
      return;
    }

    setFilteredUsers(localFiltered);
  };

  useEffect(() => {
    (async () => {
      try {
        const adminResult = await FindAdmins();
        console.log(adminResult.data.message)
        if (adminResult && adminResult.data.success) {
          setAdmins(adminResult.data.message);
          
        }

       
      } catch (err) {
        console.error("Init load error", err);
      }
    })();

    const fetchMovies = async () => {
      try {
        const result = await FindAllMovies();
        if (result.data.success) {
          setMovies(result.data.movies.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };

    const fetchShows = async () => {
      try {
        const result = await FindShows();
        if (result && result.data.success) {
          setShows(result.data.shows);
        }
      } catch (err) {
        console.error("Failed to fetch shows", err);
      }
    };

    fetchMovies();
    fetchShows();
  }, []);

  return (
    <div className="w-full px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Admins Section */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Admins</h2>
        <div className="space-y-3">
          {admins.map((admin) => (
            
            <div
              key={admin._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={admin.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{admin.email}</p>
                  <p className="text-sm text-gray-500">ADMIN</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search users by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Search size={16} /> Search
          </button>
        </div>

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.admin ? "ADMIN" : "USER"}
                    </p>
                  </div>
                </div>
                {!user.admin && (
                  <button
                    onClick={() => handleMakeAdmin(user._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <ShieldCheck size={16} /> Make Admin
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shows and Movies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shows */}
        <div className="bg-white border rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shows</h2>
          </div>
          <div className="space-y-3">
            {shows.map((show) => (
              <div
                key={show._id}
                className="bg-gray-50 p-3 rounded space-y-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={show.movie.thumbnail}
                    alt={show.movie.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-lg">{show.movie.title}</p>
                    <p className="text-sm text-gray-500">Screen: {show.screen.name}</p>
                    <p className="text-sm text-gray-500">Start: {new Date(show.startTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">End: {new Date(show.endTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewShow(show._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => handleDeleteShow(show._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Movies */}
        <div className="bg-white border rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4" >
            <h2 className="text-xl font-semibold">Top 5 Movies</h2>
            <button
              onClick={handleNewMovie}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <PlusCircle size={16} /> Add New Movie
            </button>
          </div>
          <div className="space-y-3">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded"
                onClick={()=>{
                  navigate(`/admin/movies/${movie._id}`)
                }}
              >
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <p className="font-medium text-sm">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
