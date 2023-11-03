import React from 'react';

function TestimonialCard({ testimonial, image }) {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 shadow rounded-lg p-4 w-full max-w-md transition-transform transform hover:scale-105">
      <div className="flex flex-col items-center sm:flex-row"> {/* Adjust layout for small screens */}
        {image && (
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4 sm:mb-0"> {/* Move image to the top in phone view */}
            <img
              src={image.imageUrl}
              alt="Testimonial"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="mr-2">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-2xl ${index < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm font-semibold">&ldquo;{testimonial.testimonial_text}&rdquo;</p>
          <p className="text-sm font-semibold">
            - <span className="font-bold">{testimonial.user_name}</span>,
            <span className="text-gray-600"> {testimonial.occupation} at {testimonial.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
