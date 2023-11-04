import axios from "axios";

const API_URL = process.env.NODE_ENV === "production" ? "/api/auth/" : "/api/auth/";

const register = (username, email, password, fullName, phoneNo, roles) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    fullName,
    phoneNo,
    roles,
  }, {
    withCredentials: true, // Include credentials (cookies) with the request
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    }, {
      withCredentials: true, // Include credentials (cookies) with the request
    })
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem("users", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("users");
  return axios.post(API_URL + "signout", null, {
    withCredentials: true, // Include credentials (cookies) with the request
  }).then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("users"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
