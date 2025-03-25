import React from "react";

const getRandomColor = () => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
      <span className="sr-only">Loading...</span>
      <div className={`h-8 w-8 rounded-full animate-bounce [animation-delay:-0.3s] ${getRandomColor()}`} />
      <div className={`h-8 w-8 rounded-full animate-bounce [animation-delay:-0.15s] ${getRandomColor()}`} />
      <div className={`h-8 w-8 rounded-full animate-bounce ${getRandomColor()}`} />
    </div>
  );
};

export default LoadingSpinner;
