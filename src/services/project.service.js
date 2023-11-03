import axios from "axios";

const API_URL = "/api"; // Replace with your actual API URL

// Fetch all projects
const getAllProjects = () => {
  return axios
    .get(`${API_URL}/projects`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
      throw error;
    });
};

// Fetch a project by ID
const getProjectById = (projectId) => {
  return axios
    .get(`${API_URL}/projects/${projectId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching project by ID:", error);
      throw error;
    });
};

// Create a new project
const createProject = (newProject) => {
  return axios
    .post(`${API_URL}/projects`, newProject)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating a project:", error);
      throw error;
    });
};

// Update an existing project
const updateProject = (projectId, updatedProject) => {
  return axios
    .put(`${API_URL}/projects/${projectId}`, updatedProject)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating the project:", error);
      throw error;
    });
};

// Delete a project
const deleteProject = (projectId) => {
  return axios
    .delete(`${API_URL}/projects/${projectId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting the project:", error);
      throw error;
    });
};

const ProjectService = {
  getAllProjects,
  getProjectById, // Add getProjectById to the service
  createProject,
  updateProject,
  deleteProject,
};

export default ProjectService;
