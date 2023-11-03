import React, { useState, useEffect } from 'react';
import ProjectService from '../../services/project.service';
import ImageService from '../../services/image.service';
import ProjectCard from './ProjectCard';
import AuthService from '../../services/auth.service';
import NotFoundPage from '../NotFoundPage';
import { Link } from 'react-router-dom';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const currentUser = AuthService.getCurrentUser();

function AddProject() {
  const [project, setProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    project_image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
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
              setProject({ ...project, project_image: uploadedImage.s3Key });
              alert('Image uploaded and associated with the project!');
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

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdProject = await ProjectService.createProject(project);

      if (createdProject) {
        alert('Project submitted successfully!');
        // Reset the form or perform any other actions
      } else {
        alert('Error creating the project.');
      }
    } catch (error) {
      alert('Error creating the project: ' + error.message);
    }
  };

  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    ProjectService.getAllProjects()
      .then((projects) => {
        setAllProjects(projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
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

  const handleProjectDelete = async (projectId, projectImageS3Key) => {
    try {
      if (projectImageS3Key) {
        await ImageService.deleteImage(projectImageS3Key);
      }

      await ProjectService.deleteProject(projectId);

      setAllProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );

      alert('Project deleted successfully!');
    } catch (error) {
      alert('Error deleting the project: ' + error.message);
    }
  };

  if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
    return <NotFoundPage />;
  }

  const isProjectEditable = (adminUser) => {
    return currentUser && currentUser._id === adminUser;
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-300'>
    <div className="container mx-auto mt-16 flex justify-center">
  <div className="w-full p-6 bg-opacity-70 backdrop-blur-100 rounded-lg shadow-md">
    <h1 className="text-2xl text-center font-bold mb-4">
        {step === 1 ? 'Step 1:' : 'Step 2: Enter Project Details'}
      </h1>
      {step === 1 && (
  <form className="max-w-md mx-auto">
    <div className="mb-4 relative">
      <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
        Upload Image:
      </label>
      <label
        htmlFor="file-input"
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded cursor-pointer hover:from-blue-500 hover:to-blue-700"
      >
        Choose File
      </label>
      <input
        type="file"
        id="file-input"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {selectedImage && (
        <div className="mt-2 text-sm text-gray-700">
          Chosen File: {selectedImage.name}
        </div>
      )}
    </div>
    <div className="mb-4">
      <button
        type="button"
        onClick={handleNextStep}
        className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
      >
        {step === 1 ? 'Next' : 'Submit Project'}
      </button>
    </div>
  </form>
)}

      {step === 2 && (
        <form className="max-w-md mx-auto">
          <div className="mb-4 relative">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            ></textarea>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={project.startDate}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={project.endDate}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
              required
            />
          </div>
          <div className="mb-4">
            <button
              onClick={handleProjectSubmit}
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              Submit Project
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
             {allProjects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Your Projects</h2>
              <Carousel showArrows={true} infiniteLoop={true} emulateTouch={true}>
                {allProjects
                  .filter((project) => currentUser.id === project.adminUser)
                  .map((project) => {
                    const matchingImage = images.find((image) => image.s3Key === project.project_image);
                    return (
                      <div key={project._id} className="relative">
                        <ProjectCard project={project} image={matchingImage} />
                        <div className="flex justify-end items-center mt-4 absolute top-0 right-0 left-0">
                          <button
                            onClick={() => handleProjectDelete(project._id, matchingImage.s3Key)}
                            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-4"
                          >
                            Delete
                          </button>
                          <Link
                            to={`/admin/projects/${project._id}/edit`}
                            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ml-4"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </Carousel>
            </div>
          )}
           
      </div>
    </div>
    </div>
    </div>
  );
}

export default AddProject;