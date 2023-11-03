import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return <div className="text-red-600">This field is required!</div>;
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return <div className="text-red-600">This is not a valid email.</div>;
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="text-red-600">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="text-red-600">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeFullName = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
  };

  const onChangePhoneNo = (e) => {
    const phoneNo = e.target.value;
    setPhoneNo(phoneNo);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password, fullName, phoneNo, ["user"]).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-purple-100 flex justify-center items-center">
      <div className="w-50 shadow-md mx-auto p-6 rounded-lg  bg-opacity-70 backdrop-blur-100 mt-8 flex">
        <div className="w-50 p-6">
          <h2 className="text-4xl font text-center text-black mb-6">
            REGISTER
          </h2>
          <Form onSubmit={handleRegister} ref={form}>
            {!successful && (
              <div>
                <div className="mb-4">
                  <label htmlFor="username" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required, vusername]}
                    placeholder="Username"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, validEmail]}
                    placeholder="Email"
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
                    validations={[required, vpassword]}
                    placeholder="Password"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="fullName" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="fullName"
                    value={fullName}
                    onChange={onChangeFullName}
                    placeholder="Full Name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNo" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="phoneNo"
                    value={phoneNo}
                    onChange={onChangePhoneNo}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="text-red-600 mt-4"></div>
            )}
            {successful && (
              <div className="text-green-600 mt-4">{message}</div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
        
        <div className="w-50 p-4" style={{ marginTop: "50px" }}>
  <div className="flex">
    <img
      src="https://i.ibb.co/h11cQvB/imgonline-com-ua-twotoone-SNcgab-P2fb-Oatl-G3.png"
      alt=""
      className="w-100 h-30 mx-1"
    />
  </div>
</div>


      </div>
    </div>
  );
};

export default Register;
