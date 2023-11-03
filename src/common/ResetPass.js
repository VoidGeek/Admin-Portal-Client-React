import React, { useState } from 'react';
import axios from 'axios';
import UserService from '../services/user.service'; // Import the UserService

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

function ResetPass() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestReset = () => {
    axios
      .post(`${API_URL}/api/request`, { email })
      .then((response) => {
        setMessage(response.data.message);
        setStep(2); // Move to the OTP entry step
      })
      .catch((error) => {
        setMessage('Error sending request. Please try again.');
      });
  };

  const handleVerifyOTP = () => {
    axios
      .post(`${API_URL}/api/verify`, { email, otp })
      .then((response) => {
        setMessage(response.data.message);
        setStep(3); // Move to the new password entry step
      })
      .catch((error) => {
        setMessage('Error verifying OTP. Please try again.');
      });
  };

  // Function to update the user's password
 // Function to update the user's password
const handleUpdatePassword = () => {
    // Assuming you have fetched the user by email using UserService
    UserService.getAllUsers()
      .then((users) => {
        const user = users.find((user) => user.email === email);
        if (user) {
          // Update the user's password using UserService
          UserService.updateUser(user._id, { password: newPassword })
            .then((response) => {
              setMessage(response.message);
              // Display the success message and redirect to the login page after a delay
              setTimeout(() => {
                setMessage('Password updated successfully.');
                // Redirect to the login page
                window.location.href = '/login'; // You can use React Router for a more controlled navigation
              }, 2000); // Delay for 2 seconds (2000 milliseconds)
            })
            .catch((error) => {
              setMessage('Error updating the password. Please try again.');
            });
        } else {
          setMessage('User not found');
        }
      })
      .catch((error) => {
        setMessage('Error fetching user data');
      });
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">Reset Password</h1>

        {step === 1 && (
          <>
            <p className="text-red-500 mb-4 text-center">{message}</p>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover-bg-blue-600"
              onClick={handleRequestReset}
            >
              Request OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-red-500 mb-4 text-center">{message}</p>
            <input
              type="text"
              className="w-full p-2 my-4 border border-gray-300 rounded-lg"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(parseInt(e.target.value, 10))}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover-bg-blue-600"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-red-500 mb-4 text-center">{message}</p>
            <input
              type="password"
              className="w-full p-2 my-4 border border-gray-300 rounded-lg"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover-bg-blue-600"
              onClick={handleUpdatePassword}
            >
              Set New Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPass;
