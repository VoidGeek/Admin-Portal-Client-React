import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
      <p className="text-lg text-gray-600">The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFoundPage;
