import React, { useState, useEffect } from 'react';
import ProjectService from '../../services/project.service';
import ImageService from '../../services/image.service';
import { useParams, useNavigate } from 'react-router-dom';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [project, setProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    project_image: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the existing project data for editing
    ProjectService.getProjectById(id)
      .then((fetchedProject) => {
        setProject(fetchedProject);

        // If the project has a project_image (s3Key), fetch the image
        if (fetchedProject.project_image) {
          ImageService.getImageByKey(fetchedProject.project_image)
            .then((image) => {
              setSelectedImage(image); // Set the fetched image as the selected image
              setSelectedImageKey(fetchedProject.project_image); // Set the image key
            })
            .catch((error) => {
              console.error('Error fetching image:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
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
              // Update the project image
              const updatedImages = [...images, updatedImage];
              setImages(updatedImages);

              // Update the project state with the new s3Key
              setProject((prevProject) => ({
                ...prevProject,
                project_image: updatedImage.s3Key,
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

              // Set the s3Key for the uploaded image in the project state
              setProject((prevProject) => ({
                ...prevProject,
                project_image: uploadedImage.s3Key,
              }));

              alert('Image uploaded successfully and associated with the project!');
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
    setProject({ ...project, [name]: value });
  };

  const handleProjectUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedProject = await ProjectService.updateProject(id, project);

      if (updatedProject) {
        alert('Project updated successfully!');
        navigate('/admin/projects');
      } else {
        alert('Error updating the project.');
      }
    } catch (error) {
      alert('Error updating the project: ' + error.message);
    }
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-purple-300 to-purple-100  justify-center h-screen">
      <div className="w-full max-w-md">
        {step === 1 ? (
          // Step 1: Image Update
          <div>
            <h1 className="text-2xl font-bold mb-4">Update Project Image</h1>
            <form>
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
          // Step 2: Project Update
          // Inside the Step 2: Project Update section
<div className='<div className="w-50 shadow-md mx-auto p-6 rounded-lg  bg-opacity-70 backdrop-blur-100 mt-8 flex">'>
  <h1 className="text-2xl text-center font-bold mb-4">Edit Project</h1>
  <form>
    {/* Rest of the form for updating project details */}
    <div className="mb-4">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        Project Title:
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={project.title}
        onChange={handleInputChange}
        required
        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Project Description:
      </label>
      <textarea
        id="description"
        name="description"
        value={project.description}
        onChange={handleInputChange}
        required
        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
      ></textarea>
    </div>
    <div className="mb-4">
      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
        Start Date:
      </label>
      <input
        type="date"
        id="startDate"
        name="startDate"
        defaultValue={project.startDate} // Set the default value
        onChange={handleInputChange}
        required
        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
        End Date:
      </label>
      <input
        type="date"
        id="endDate"
        name="endDate"
        defaultValue={project.endDate} // Set the default value
        onChange={handleInputChange}
        required
        className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
      />
    </div>
    <button
      onClick={handleProjectUpdate}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Update Project
    </button>
  </form>
</div>

        )}
      </div>
    </div>
  );
}

export default EditProject;
