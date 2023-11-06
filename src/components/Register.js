import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import "react-phone-number-input/style.css";
import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return <div className="text-red-600">This field is required!</div>;
  }
};

const phrequired = (value) => {
  if (!value) {
    return <div className="text-red-600">Please enter a valid phone no.!</div>;
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
  const [submitting, setSubmitting] = useState(false);
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
  const onChangePhoneNo = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
  
    // Allow only exactly 10 digits
    if (formattedValue.length === 10) {
      setPhoneNo(formattedValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-purple-100 flex justify-center items-center">
      <div className="w-auto mx-auto p-6 mt-8 mb-8 rounded-lg shadow-md bg-opacity-70 backdrop-blur-100 flex flex-col">

        {/* Image section for mobile view */}
        <div className="w-full p-4" style={{ marginBottom: "20px" }}>
          <h2 className="text-4xl font text-center text-black mb-6">
            REGISTER
          </h2>
            <img
              src="https://i.ibb.co/h11cQvB/imgonline-com-ua-twotoone-SNcgab-P2fb-Oatl-G3.png"
              alt=""
              className="w-60 h-30 mx-8"
            />
        </div>

        {/* Form section */}
        <div className="w-full p-6">
          <Form onSubmit={handleRegister} ref={form}>
            {!successful && (
              <div>
                <div className="mb-4">
                  <label htmlFor="username" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus-border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
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
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus-border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
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
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus-border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
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
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus-border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="fullName"
                    value={fullName}
                    onChange={onChangeFullName}
                    validations={[required]}
                    placeholder="Full Name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNo" className="text-gray-500"></label>
                  <Input
                    type="text"
                    className="block w-full px-3 py-2 border-b-2 border-gray-300 focus-border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                    name="phoneNo"
                    value={phoneNo}
                    onChange={onChangePhoneNo}
                    validations={[phrequired]}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="text-center">
                <button
                  type="submit"
                  className="relative bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-2 px-4 text-base md:text-lg lg:text-xl hover:from-blue-600 hover:to-blue-400 hover:text-white transition-transform duration-500 ease-in-out hover:-translate-y-2 overflow-hidden group"
                >
                  <span className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                  {submitting ? "Submitting..." : <span className="relative z-10">Sign Up</span>}
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
      </div>
    </div>
  );
};

export default Register;
