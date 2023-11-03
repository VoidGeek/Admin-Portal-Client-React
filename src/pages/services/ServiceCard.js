import React, { useState } from 'react';

function ServiceCard({ service, image }) {
  const benefitsArray = service.benefits.split('\n');

  // State to track whether each benefit is expanded or not
  const [expandedBenefits, setExpandedBenefits] = useState({});

  // Function to toggle the expansion state of a benefit
  const toggleBenefit = (index) => {
    setExpandedBenefits((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-100">
      <div className="flex flex-col md:flex-row hover-bg-gray-100 dark-border-gray-700 dark-bg-blue-100 dark-hover-bg-200">
        {image && (
          <img
            className="object-cover w-full h-96 md:h-auto md-w-96 md-rounded-none md-rounded-l-lg"
            src={image.imageUrl}
            alt="Service"
          />
        )}
        <div className="flex flex-col p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold text-center tracking-tight text-gray-900 dark-text-black">
            {service.service_name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark-text-gray-400 text-justify">
            {service.service_info}
          </p>
          <div className="text-lg font-bold text-gray-900 dark-text-black">
            Benefits:
          </div>
          <ul className="ml-6 list-inside space-y-2">
            {benefitsArray.map((benefit, index) => (
              <li
                key={index}
                className="text-gray-700 dark-text-gray-400 cursor-pointer"
                onClick={() => toggleBenefit(index)}
              >
                <div className="flex items-center">
                  {/* Include the provided SVG code as points */}
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {benefit.split(":")[0]} {/* Display only the heading part */}
                </div>
                {expandedBenefits[index] && (
                  <div className="text-gray-700 dark-text-gray-400 ml-6 text-left">
                    {benefit.split(":")[1]} {/* Display the body when expanded */}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
