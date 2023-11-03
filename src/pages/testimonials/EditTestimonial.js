import React, { useState, useEffect } from 'react';
import TestimonialService from '../../services/testimonial.service';
import ImageService from '../../services/image.service';
import { useParams, useNavigate } from 'react-router-dom';

function EditTestimonial() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageKey, setSelectedImageKey] = useState(null);
    const [testimonial, setTestimonial] = useState({
      testimonial_text: '',
      user_name: '',
      occupation: '',
      company: '',
      rating: 0,
      test_image: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        // Fetch the existing testimonial data for editing
        TestimonialService.getTestimonialById(id)
          .then((fetchedTestimonial) => {
            setTestimonial(fetchedTestimonial);
      
            // If the testimonial has a test_image (s3Key), fetch the image
            if (fetchedTestimonial.test_image) {
              ImageService.getImageByKey(fetchedTestimonial.test_image)
                .then((image) => {
                  setSelectedImage(image); // Set the fetched image as the selected image
                  setSelectedImageKey(fetchedTestimonial.test_image); // Set the image key
                })
                .catch((error) => {
                  console.error('Error fetching image:', error);
                });
            }
          })
          .catch((error) => {
            console.error('Error fetching testimonial:', error);
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
                    // Update the testimonial image
                    const updatedImages = [...images, updatedImage];
                    setImages(updatedImages);
                    console.log(updatedImage.s3Key)
                    // Update the testimonial state with the new s3Key
                    setTestimonial((prevTestimonial) => ({
                      ...prevTestimonial,
                      test_image: updatedImage.s3Key,
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
              }else {
              // If no image key is selected, it means you want to create a new image
              ImageService.uploadImage(formData)
                .then((uploadedImage) => {
                  setImages([...images, uploadedImage]);
                  
                  // Set the s3Key for the uploaded image in the testimonial state
                  setTestimonial((prevTestimonial) => ({
                    ...prevTestimonial,
                    test_image: uploadedImage.s3Key,
                  }));
      
                  alert('Image uploaded successfully and associated with the testimonial!');
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
    setTestimonial({ ...testimonial, [name]: value });
  };

  const handleTestimonialUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedTestimonial = await TestimonialService.updateTestimonial(id, testimonial);

      if (updatedTestimonial) {
        alert('Testimonial updated successfully!');
        navigate('/admin/testimonials');
      } else {
        alert('Error updating the testimonial.');
      }
    } catch (error) {
      alert('Error updating the testimonial: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        {step === 1 ? (
          // Step 1: Image Update
          <div>
            <h1 className="text-2xl font-bold mb-4">Update Testimonial Image</h1>
            <form>
              <div className="mb-4">
                <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700">
                  Current Image: {testimonial.test_image}
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
          // Step 2: Testimonial Update
          <div>
            <h1 className="text-2xl font-bold mb-4">Edit Testimonial</h1>
            <form>
              {/* Rest of the form for updating testimonial details */}
              <div className="mb-4">
                <label htmlFor="testimonial_text" className="block text-sm font-medium text-gray-700">
                  Testimonial Text:
                </label>
                <textarea
                  id="testimonial_text"
                  name="testimonial_text"
                  value={testimonial.testimonial_text}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={testimonial.user_name}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                  Occupation:
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={testimonial.occupation}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company:
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={testimonial.company}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rating:</label>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setTestimonial({ ...testimonial, rating: index + 1 })}
                      className={`text-3xl ${
                        index < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                      } transition-colors duration-300 ease-in-out`}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleTestimonialUpdate}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update Testimonial
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditTestimonial;
