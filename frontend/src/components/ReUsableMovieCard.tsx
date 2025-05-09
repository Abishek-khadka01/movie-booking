import React from "react";

interface MovieCardProps {
  _id: string;
  title: string;
  thumbnail: string;
  releaseDate: string;
  rating?: number;
  onClick?: (id: string) => void;
}

const ReusableMovieCard: React.FC<MovieCardProps> = ({
  _id,
  title,
  thumbnail,
  releaseDate,
  rating,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick?.(_id)}
      className="w-72 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden"
    >
      <img
        src={thumbnail || "/placeholder.jpg"}
        alt={`${title} thumbnail`}
        className="w-full h-60 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          📅 {new Date(releaseDate).toLocaleDateString()}
        </p>
        {rating !== undefined && (
          <p className="text-sm text-yellow-600">⭐ {rating.toFixed(1)}</p>
        )}
      </div>
    </div>
  );
};

export default ReusableMovieCard;
