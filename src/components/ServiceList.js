import React, { useEffect, useState } from 'react';
import ServiceCard from '../pages/services/ServiceCard'; // Assuming you have a ServiceCard component
import ServiceService from '../services/service.service'; // Replace with your service file
import ImageService from '../services/image.service';

function SkeletonCard() {
  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-100">
      <div className="flex flex-col md:flex-row hover-bg-gray-100 dark-border-gray-700 dark-bg-blue-100 dark-hover-bg-200">
        <div className="w-full h-96  md:h-96 md:w-96 md-rounded-none md-rounded-l-lg overflow-hidden">
          {/* Placeholder for the image */}
        </div>
        <div className="flex flex-col p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold text-center tracking-tight text-gray-900 dark-text-black">
            {/* Placeholder for service name */}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark-text-gray-400 text-justify">
            {/* Placeholder for service info */}
          </p>
          <div className="text-lg font-bold text-gray-900 dark-text-black">
            Benefits:
          </div>
          <ul className="ml-6 list-inside space-y-2">
            {/* Placeholder for benefits */}
            <li className="text-gray-700 dark-text-gray-400">
              <div className="flex items-center">
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
                {/* Placeholder for benefit title */}
              </div>
              <div className="text-gray-700 dark-text-gray-400 ml-6">
                {/* Placeholder for benefit body */}
              </div>
            </li>
            {/* You can add more placeholders for additional benefits */}
          </ul>
        </div>
      </div>
    </div>
  );
}


const Homepage = () => {
  const [allServices, setAllServices] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      ServiceService.getAllServices(),
      ImageService.getAllImages(),
    ])
      .then(([services, imageData]) => {
        // Sort services by service date or another relevant property
        services.sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate));
        setAllServices(services);
        setImages(imageData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      // Navigate to the next service when the down arrow key is pressed
      if (currentServiceIndex < allServices.length - 1) {
        setCurrentServiceIndex(currentServiceIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      // Navigate to the previous service when the up arrow key is pressed
      if (currentServiceIndex > 0) {
        setCurrentServiceIndex(currentServiceIndex - 1);
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-300 to-grey-300">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Services</h2>
        <div className="space-y-8">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            allServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                image={images.find((image) => image.s3Key === service.service_image)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
