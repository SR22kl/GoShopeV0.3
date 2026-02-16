import React from "react";

interface NotFoundProps {
  message?: string;
  statusCode?: number;
}

const NotFound: React.FC<NotFoundProps> = ({ message, statusCode = 404 }) => {
  const defaultMessage = `Oops! The page you're looking for could not be found.`;
  const displayMessage = message || defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans rounded-lg">
      <h1 className="text-6xl text-red-500 border-2 border-gray-300 rounded-lg mb-4 p-2 shadow-lg">
        {statusCode}
      </h1>
      <p className="text-xl text-gray-800 text-center mb-8 px-8">
        {displayMessage}
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-8 py-4 cursor-pointer bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 duration-300 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
