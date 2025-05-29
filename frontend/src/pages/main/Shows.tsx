import { useEffect, useState } from "react";
import { FindShows } from "../../services/showApis";
import { ShowType } from "../../types/showTypes";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../context/userContext";

const Shows = () => {
  const [shows, setShows] = useState<ShowType[]>([]);
  const navigate = useNavigate();
  const user = useUserStore.getState().user;

  const findShows = async () => {
    try {
      const result = await FindShows();
      const { data } = result;

      if (!data.success) {
        throw new Error(data.message);
      }

      setShows(data.shows);
    } catch (error: any) {
      alert(error.message || error);
    }
  };

  useEffect(() => {
    findShows();
  }, []);

  const handleClick = (id: string) => {
    navigate(`/shows/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shows</h1>
      {shows.map(({ _id, movie, screen }) => (
        <div
          key={_id}
          className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200 flex gap-6 items-start"
        >
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-40 h-auto rounded-md object-cover"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
            <h3 className="text-lg font-medium text-gray-700">
              Screen: {screen.name}
            </h3>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => handleClick(_id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Show
              </button>

              {user?.admin && (
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete Show
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shows;
