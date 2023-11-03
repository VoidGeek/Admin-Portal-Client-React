import React, { useState, useEffect } from 'react';
import ServiceService from '../../services/service.service';
import ImageService from '../../services/image.service';
import { useParams, useNavigate } from 'react-router-dom';

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [service, setService] = useState({
    service_name: '',
    service_info: '',
    benefits:'',
    service_image: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the existing service data for editing
    ServiceService.getServiceById(id)
      .then((fetchedService) => {
        setService(fetchedService);

        // If the service has a service_image (s3Key), fetch the image
        if (fetchedService.service_image) {
          ImageService.getImageByKey(fetchedService.service_image)
            .then((image) => {
              setSelectedImage(image); // Set the fetched image as the selected image
              setSelectedImageKey(fetchedService.service_image); // Set the image key
            })
            .catch((error) => {
              console.error('Error fetching image:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching service:', error);
      });
  }, [id]);

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedImage) {
        setLoading(true); // Set loading to true during the upload or update

        const formData = new FormData();
        formData.append('image', selectedImage);

        if (selectedImageKey) {
          // If an image key is selected, it means you want to update an existing image
          ImageService.updateImage(selectedImageKey, formData)
            .then((updatedImage) => {
              // Update the service image
              const updatedImages = [...images, updatedImage];
              setImages(updatedImages);

              // Update the service state with the new s3Key
              setService((prevService) => ({
                ...prevService,
                service_image: updatedImage.s3Key,
              }));

              alert('Image updated successfully!');
              setStep(2);
            })
            .catch((error) => {
              alert('Error updating image: ' + error.message);
            })
            .finally(() => {
              setLoading(false); // Reset loading when the operation is complete
            });
        } else {
          // If no image key is selected, it means you want to create a new image
          ImageService.uploadImage(formData)
            .then((uploadedImage) => {
              setImages([...images, uploadedImage]);

              // Set the s3Key for the uploaded image in the service state
              setService((prevService) => ({
                ...prevService,
                service_image: uploadedImage.s3Key,
              }));

              alert('Image uploaded successfully and associated with the service!');
              setStep(2);
            })
            .catch((error) => {
              alert('Error uploading image:' + error.message);
            })
            .finally(() => {
              setLoading(false); // Reset loading when the operation is complete
            });
        }

        // Reset the selected image and key
        setSelectedImage(null);
        setSelectedImageKey(null);
      } else {
        alert('Please select an image to upload.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleServiceUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedService = await ServiceService.updateService(id, service);

      if (updatedService) {
        alert('Service updated successfully!');
        navigate('/admin/services');
      } else {
        alert('Error updating the service.');
      }
    } catch (error) {
      alert('Error updating the service: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Update Service Image</h1>
            <form>
              <div className="mb-4">
                <label htmlFor="selectedImage" className="">
                  Current Image: {service.service_image}
                </label>
              </div>
              <div className="mb-4">
                <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700">
                  Select New Image:
                </label>
                <input
                  type="file"
                  id="selectedImage"
                  name="selectedImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {selectedImage ? (
                  <p>Selected Image: {selectedImage.name}</p>
                ) : (
                  <p>No file chosen</p>
                )}
              </div>
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Uploading...' : selectedImageKey ? 'Update' : 'Upload'}
              </button>
            </form>
            <button
              onClick={() => setStep(2)}
              className="text-blue-500 mt-2 hover:underline cursor-pointer"
            >
              Skip this step
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
            <form>
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
                  required
                  className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="service_info" className="block text-sm font-medium text-gray-700">
                  Service Info:
                </label>
                <textarea
                  id="service_info"
                  name="service_info"
                  value={service.service_info}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
                  Service Info:
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={service.benefits}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                ></textarea>
              </div>
              <button
                onClick={handleServiceUpdate}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update Service
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditService;
