import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const roleMapping = {
  "653a4db64bcb085afa064539": {
    name: "ROLE_ADMIN",
    badgeClass: "bg-gradient-to-r from-red-400 to-red-600",
  },
  "653a4db64bcb085afa064538": {
    name: "ROLE_USER",
    badgeClass: "bg-gradient-to-r from-green-400 to-green-600",
  },
  "653a4db64bcb085afa06453a": {
    name: "ROLE_MODERATOR",
    badgeClass: "bg-gradient-to-r from-blue-400 to-blue-600",
  },
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    UserService.getAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  const handleRoleChange = (userId, newRole) => {
    const userToUpdate = users.find((user) => user._id === userId);

    if (!userToUpdate) {
      console.error("User not found.");
      return;
    }

    setLoading(true);

    UserService.getUserById(userId)
      .then((user) => {
        const currentRoles = user.roles.map((roleId) => roleMapping[roleId].name);

        if (!currentRoles.includes("ROLE_MODERATOR")) {
          const isUser = currentRoles.includes("ROLE_USER");
          const isAdmin = currentRoles.includes("ROLE_ADMIN");

          if (newRole === "ROLE_ADMIN" && isUser) {
            const updatedRoles = ["653a4db64bcb085afa064539"];
            updateRolesAndState(userId, updatedRoles, "User promoted to ROLE_ADMIN.");
          }

          if (newRole === "ROLE_USER" && isAdmin) {
            const updatedRoles = ["653a4db64bcb085afa064538"];
            updateRolesAndState(userId, updatedRoles, "User demoted to ROLE_USER.");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  };

  const updateRolesAndState = (userId, updatedRoles, message) => {
    UserService.updateUser(userId, { roles: updatedRoles })
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, roles: updatedUser.roles } : user
          )
        );
        setSuccessMessage(message);
        fetchUsers();
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setLoading(false);
      });
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-400 flex items-center justify-center">
      <div className="flex flex-wrap justify-center">
        {loading ? (
          [1, 2, 3, 4].map((skeletonId) => (
            <div
              key={skeletonId}
              className="max-w-sm m-2 p-4 bg-opacity-25 backdrop-blur-lg bg-gray-100 border border-opacity-25 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
            >
              <div className="animate-pulse">
                <div className="w-40 h-6 bg-blue-400 rounded-full mb-2"></div>
                <div className="w-48 h-4 bg-blue-400 mb-2"></div>
                <div className="flex space-x-2">
                  <div className="w-12 h-4 bg-blue-400 rounded-full"></div>
                  <div className="w-12 h-4 bg-blue-400 rounded-full"></div>
                  <div className="w-12 h-4 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="max-w-sm m-2 p-4 bg-opacity-25 backdrop-blur-lg bg-gray-100 border border-opacity-25 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  <FontAwesomeIcon icon={faUser} /> {user.username} {/* Icon for name */}
                </h3>
                <p className="text-sm text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} /> {user.email} {/* Icon for email */}
                </p>
                <div className="mt-2">
                  {user.roles.map((roleId) => (
                    <span
                      key={roleId}
                      className={`text-white text-xs px-2 py-1 rounded-full mr-2 ${roleMapping[roleId].badgeClass}`}
                    >
                      {roleMapping[roleId].name}
                    </span>
                  ))}
                </div>
              </div>
              {user.roles.includes("653a4db64bcb085afa06453a") ? (
                <p className="text-center text-green-500 font-semibold"></p>
              ) : (
                <div className="text-center">
                  {user.roles.includes("653a4db64bcb085afa064538") && (
                    <button
                      onClick={() => handleRoleChange(user._id, "ROLE_ADMIN")}
                      className="block bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Promote
                    </button>
                  )}
                  {user.roles.includes("653a4db64bcb085afa064539") && (
                    <button
                      onClick={() => handleRoleChange(user._id, "ROLE_USER")}
                      className="block bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Demote
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;