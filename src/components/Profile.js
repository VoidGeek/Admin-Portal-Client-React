import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faPhone,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-green-200 flex justify-center items-center">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-100 text-white p-4 text-center rounded-t-md">
            <h2 className="text-2xl">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              {currentUser.username}'s Profile
            </h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
              <strong>ID:</strong> {currentUser.id}
            </div>
            <div className="mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-500" />
              <strong>Email:</strong> {currentUser.email}
            </div>
            <div className="mb-4">
              <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
              <strong>Full Name:</strong> {currentUser.fullName}
            </div>
            <div className="mb-4">
              <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-500" />
              <strong>Phone Number:</strong> {currentUser.phoneNo}
            </div>
            <div className="mb-4">
              <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
              <strong>Authorities:</strong>
              <ul className="list-disc pl-6 mt-2">
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => (
                    <li key={index}>
                      {role === "ROLE_MODERATOR" || role === "ROLE_ADMIN" ? (
                        <span className="bg-gradient-to-br from-[#FF5733] to-[#FFC300] text-white p-1 rounded">
                          {role}
                        </span>
                      ) : (
                        role
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
