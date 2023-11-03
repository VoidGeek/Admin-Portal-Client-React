import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="text-red-600">This field is required!</div>
    );
  }
};

const Login = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password, rememberMe).then(
        () => {
          navigate("/profile");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-green-100 flex justify-center items-center">
      <div className="w-auto mx-auto p-6 rounded-lg shadow-md bg-opacity-70 backdrop-blur-100 mt-8 flex">
        <div className="w-full p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
          <Form onSubmit={handleLogin} ref={form}>
            <div className="mb-4">
              <label htmlFor="username" className="text-gray-500"></label>
              <Input
                type="text"
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                name="username"
                value={username}
                onChange={onChangeUsername}
                validations={[required]}
                placeholder="Username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="text-gray-500"></label>
              <Input
                type="password"
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
                placeholder="Password"
              />
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center text-gray-500">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  onChange={toggleRememberMe}
                />
                <span className="ml-2">Remember Me</span>
              </label>
            </div>

            <div className="text-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin inline-block h-5 w-5 mr-3 "></span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>

            {message && (
              <div className="text-red-600 mt-4">{message}</div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <div className="mt-4 text-center">
            <a href="/login/reset" className="text-green-500 hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
        
        <div className="w-full p-1" style={{ marginTop: "50px" }}>
          <img
            src="https://i.ibb.co/GxmSCf0/image-2023-10-10-193405106-removebg-preview-1-1.png"
            alt=""
            className="w-180 h-60 mx-8"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Login;
