import React, { useState, useEffect } from 'react';
import TestimonialService from '../../services/testimonial.service';
import ImageService from '../../services/image.service';
import TestimonialCard from './TestimonialCard';
import AuthService from '../../services/auth.service';
import NotFoundPage from '../NotFoundPage';
import { Link } from 'react-router-dom';
const currentUser = AuthService.getCurrentUser();

function AddTestimonial() {
  const [testimonial, setTestimonial] = useState({
    testimonial_text: '',
    user_name: '',
    occupation: '',
    company: '',
    rating: 0,
    test_image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonial({ ...testimonial, [name]: value });
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
              setTestimonial({ ...testimonial, test_image: uploadedImage.s3Key });
              alert('Image uploaded and associated with the testimonial!');
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

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdTestimonial = await TestimonialService.createTestimonial(testimonial);

      if (createdTestimonial) {
        alert('Testimonial submitted successfully!');
        // Reset the form or perform any other actions
      } else {
        alert('Error creating the testimonial.');
      }
    } catch (error) {
      alert('Error creating the testimonial: ' + error.message);
    }
  };

  const [allTestimonials, setAllTestimonials] = useState([]);

  useEffect(() => {
    TestimonialService.getAllTestimonials()
      .then((testimonials) => {
        setAllTestimonials(testimonials);
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error);
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

  const handleTestimonialDelete = async (testimonialId, testImageS3Key) => {
    try {
      if (testImageS3Key) {
        await ImageService.deleteImage(testImageS3Key);
      }

      await TestimonialService.deleteTestimonial(testimonialId);

      setAllTestimonials((prevTestimonials) =>
        prevTestimonials.filter((testimonial) => testimonial._id !== testimonialId)
      );

      alert('Testimonial deleted successfully!');
    } catch (error) {
      alert('Error deleting the testimonial: ' + error.message);
    }
  };

  if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
    return <NotFoundPage />;
  }

  const isTestimonialEditable = (adminUser) => {
    return currentUser && currentUser._id === adminUser;
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-300'>
    <div className="container mx-auto mt-16 flex justify-center">
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        {step === 1 ? 'Step 1: Upload Image' : 'Step 2: Enter Testimonial'}
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
              {step === 1 ? 'Next' : 'Submit Testimonial'}
            </button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="testimonial_text" className="block text-sm font-medium text-gray-700">
              Testimonial Text:
            </label>
            <textarea
              id="testimonial_text"
              name="testimonial_text"
              value={testimonial.testimonial_text}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
              required
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
              className="border border-gray-300 rounded p-2 w-full"
              required
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
              className="border border-gray-300 rounded p-2 w-full"
              required
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
              className="border border-gray-300 rounded p-2 w-full"
              required
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
          <div className="mb-4">
            <button
              onClick={handleTestimonialSubmit}
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              Submit Testimonial
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Testimonials</h2>
        {allTestimonials
          .filter(testimonial => currentUser.id === testimonial.adminUser) // Filter by adminUser
          .map((testimonial) => {
            const matchingImage = images.find((image) => image.s3Key === testimonial.test_image);
            return (
              <div key={testimonial._id} className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-4" style={{ maxWidth: '500px' }}>
                  <TestimonialCard testimonial={testimonial} image={matchingImage} />
                  <div className="flex justify-center mt-2 space-x-2">
                    <button
                      onClick={() => handleTestimonialDelete(testimonial._id, matchingImage.s3Key)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                    <Link to={`/admin/testimonials/${testimonial._id}/edit`}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md"
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

export default AddTestimonial;
