import axios from "axios";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : "/api";  // Replace with your actual API URL

// Fetch all posts
const getAllPosts = () => {
  return axios
    .get(`${API_URL}/posts`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      throw error;
    });
};

// Fetch a post by ID
const getPostById = (postId) => {
  return axios
    .get(`${API_URL}/posts/${postId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching post by ID:", error);
      throw error;
    });
};

// Create a new post
const createPost = (newPost) => {
  return axios
    .post(`${API_URL}/posts`, newPost,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating a post:", error);
      throw error;
    });
};

// Update an existing post
const updatePost = (postId, updatedPost) => {
  return axios
    .put(`${API_URL}/posts/${postId}`, updatedPost,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating the post:", error);
      throw error;
    });
};

// Delete a post
const deletePost = (postId) => {
  return axios
    .delete(`${API_URL}/posts/${postId}`,{
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting the post:", error);
      throw error;
    });
};

const PostService = {
  getAllPosts,
  getPostById, // Add the getPostById function
  createPost,
  updatePost,
  deletePost,
};

export default PostService;
