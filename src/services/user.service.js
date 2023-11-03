import axios from "axios";

const API_URL = "/api"; // Replace with your actual API URL

const getAllUsers = () => {
  return axios
    .get(`${API_URL}/users`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      throw error;
    });
};

const createUser = (newUser) => {
  return axios
    .post(`${API_URL}/users`, newUser)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating a user:", error);
      throw error;
    });
};

const deleteUser = (userId) => {
  return axios
    .delete(`${API_URL}/users/${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting a user:", error);
      throw error;
    });
};

const updateUser = (userId, updatedUserData) => {
  return axios
    .put(`${API_URL}/users/${userId}`, updatedUserData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    });
};

const getUserById = (userId) => {
    return axios
      .get(`${API_URL}/users/${userId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
      });
  };
  
  const UserService = {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserById, // Add the getUserById function
  };
  
  export default UserService;
