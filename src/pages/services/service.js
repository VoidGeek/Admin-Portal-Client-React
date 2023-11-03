import React, { useState, useEffect } from 'react';
import ServiceService from '../../services/service.service';
import ImageService from '../../services/image.service';
import ServiceCard from './ServiceCard';
import AuthService from '../../services/auth.service';
import NotFoundPage from '../NotFoundPage';
import { Link } from 'react-router-dom';

const currentUser = AuthService.getCurrentUser();

function AddService() {
  const [service, setService] = useState({
    service_name: '',
    service_info: '',
    benefits: '',
    service_image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        ImageService.uploadImage(formData)
          .then((uploadedImage) => {
            if (uploadedImage.s3Key) {
              setImages([...images, uploadedImage]);
              setService({ ...service, service_image: uploadedImage.s3Key });
              alert('Image uploaded and associated with the service!');
              setStep(2);
            } else {
              alert('Error uploading the image.');
            }
          })
          .catch((error) => {
            alert('Error uploading the image: ' + error.message);
          });
      } else {
        alert('Please select an image to upload.');
      }
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdService = await ServiceService.createService(service);

      if (createdService) {
        alert('Service submitted successfully!');
        // Reset the form or perform any other actions
      } else {
        alert('Error creating the service.');
      }
    } catch (error) {
      alert('Error creating the service: ' + error.message);
    }
  };

  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    ServiceService.getAllServices()
      .then((services) => {
        setAllServices(services);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, []);

  useEffect(() => {
    ImageService.getAllImages()
      .then((imageData) => {
        setImages(imageData);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  const handleServiceDelete = async (serviceId, serviceImageS3Key) => {
    try {
      if (serviceImageS3Key) {
        await ImageService.deleteImage(serviceImageS3Key);
      }

      await ServiceService.deleteService(serviceId);

      setAllServices((prevServices) =>
        prevServices.filter((service) => service._id !== serviceId)
      );

      alert('Service deleted successfully!');
    } catch (error) {
      alert('Error deleting the service: ' + error.message);
    }
  };

  if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
    return <NotFoundPage />;
  }

  const isServiceEditable = (adminUser) => {
    return currentUser && currentUser._id === adminUser;
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-300'>
    <div className="container mx-auto mt-16 flex justify-center">
    <div className="container mx-auto mt-8 ">
      <h1 className="text-2xl font-bold mb-4">
        {step === 1 ? 'Step 1: Upload Image' : 'Step 2: Enter Service Details'}
      </h1>
      {step === 1 && (
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              {step === 1 ? 'Next' : 'Submit Service'}
            </button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="service_name" className="block text-sm font-medium text-gray-700">
              Service Name:
            </label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={service.service_name}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service_info" className="block text-sm font-medium text-gray-700">
              Service Information:
            </label>
            <textarea
              id="service_info"
              name="service_info"
              value={service.service_info}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Benefits:
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={service.benefits}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <button
              onClick={handleServiceSubmit}
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              Submit Service
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Services</h2>
        {allServices
          .filter((service) => currentUser.id === service.adminUser)
          .map((service) => {
            const matchingImage = images.find((image) => image.s3Key === service.service_image);
            return (
              <div key={service._id} className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-4"> {/* New card container */}
                  <ServiceCard service={service} image={matchingImage} />
                  <div className="flex justify-center mt-2"> {/* Add margin top (mt-2) */}
                    <button
                      onClick={() => handleServiceDelete(service._id, matchingImage.s3Key)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white p-2 rounded hover:bg-red-600 mr-2"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/services/${service._id}/edit`}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

      </div>
      </div>
    </div>
    </div>
  );
}

export default AddService;
