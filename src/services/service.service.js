import axios from 'axios';

const API_URL = '/api'; // Replace with your actual API URL

// Fetch all services
const getAllServices = () => {
  return axios
    .get(`${API_URL}/services`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching services:', error);
      throw error;
    });
};

// Fetch a service by ID
const getServiceById = (serviceId) => {
  return axios
    .get(`${API_URL}/services/${serviceId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching service by ID:', error);
      throw error;
    });
};

// Create a new service
const createService = (newService) => {
  return axios
    .post(`${API_URL}/services`, newService)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error creating a service:', error);
      throw error;
    });
};

// Update an existing service
const updateService = (serviceId, updatedService) => {
  return axios
    .put(`${API_URL}/services/${serviceId}`, updatedService)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error updating the service:', error);
      throw error;
    });
};

// Delete a service
const deleteService = (serviceId) => {
  return axios
    .delete(`${API_URL}/services/${serviceId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error deleting the service:', error);
      throw error;
    });
};

const ServiceService = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

export default ServiceService;
