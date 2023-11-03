import React from 'react';

function TestimonialSkeletonCard() {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 shadow rounded-lg p-4 w-full max-w-md">
      <div className="animate-pulse">
        <div className="w-32 h-32 rounded-full mb-4" /> {/* Increase width and height */}
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="mr-4 w-10 h-10 bg-gray-300 rounded-full" /> 
          ))}
        </div>
        <div className="h-6 bg-gray-300 mb-2 rounded w-full" /> {/* Increase height and full width */}
        <div className="h-6 bg-gray-300 mb-2 rounded w-3/4" /> {/* Increase height and adjust width */}
        <div className="h-6 bg-gray-300 rounded w-1/2" /> {/* Increase height and adjust width */}
      </div>
    </div>
  );
}

export default TestimonialSkeletonCard;
