import axios from "axios";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : "/api"; // Replace with your actual API URL

// Fetch all images
const getAllImages = () => {
  return axios
    .get(`${API_URL}/images`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      throw error;
    });
};

// Upload a new image
const uploadImage = (image) => {
  return axios
    .post(`${API_URL}/upload`, image,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error uploading an image:", error);
      throw error;
    });
};

// Update an image
const updateImage = (s3Key, updatedImage) => {
  return axios
    .put(`${API_URL}/images/${s3Key}`, updatedImage,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating the image:", error);
      throw error;
    });
};

// Delete an image
const deleteImage = (imageId) => {
  return axios
    .delete(`${API_URL}/images/${imageId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting the image:", error);
      throw error;
    });
};

const getImageByKey = (s3Key) => {
  return axios
    .get(`${API_URL}/images/${s3Key}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(`Error fetching image by s3Key ${s3Key}:`, error);
      throw error;
    });
};

const ImageService = {
  getAllImages,
  uploadImage,
  updateImage,
  deleteImage,
  getImageByKey, // Add the new function here
};

export default ImageService;
