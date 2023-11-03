import React, { useState, useEffect } from "react";
import ContactService from "../services/contact.service";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faEnvelope, faUser, faClock } from "@fortawesome/free-solid-svg-icons";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    ContactService.getAllContacts()
      .then((response) => {
        setContacts(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      });
  };

  const handleDeleteContact = (contactId) => {
    ContactService.deleteContact(contactId)
      .then(() => {
        // Display a "Delete successful" message
        setDeleteSuccessMessage("Delete successful");

        // Clear the message after a few seconds
        setTimeout(() => {
          setDeleteSuccessMessage(null);
        }, 3000); // Clear the message after 3 seconds (adjust the timing as needed)

        // Reload contacts after deleting
        loadContacts();
      })
      .catch((error) => {
        console.error("Error deleting contact:", error);
      });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-200 to-indigo-300">
      {/* Your existing navbar from app.js will be here */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
      ) : (
        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-opacity-40 bg-gradient-to-b from-red-100 to-blue-200 bg-white rounded-lg overflow-hidden backdrop-blur-100 shadow-lg transform transition-transform hover:scale-105"
            >
              <div className="p-4 ">
                <h5 className="text-xl font-semibold mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600 mr-2" />
                  {contact.name}
                </h5>
                <h6 className="text-gray-500 mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 mr-2" />
                  Email: {contact.email}
                </h6>
                <p className="text-gray-700 mb-2">{contact.message}</p>
                <div className="flex justify-between items-center">
                  <div className="text-gray-500">
                    <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                    Submitted: {format(new Date(contact.submitted_at), "MMM d, yyyy")}
                    <br />
                    Time: {format(new Date(contact.submitted_at), "h:mm a")}
                  </div>
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-500 py-1 px-3 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteSuccessMessage && (
        <div className="animate-slidein fixed bottom-0 right-0 left-0 bg-green-500 text-white p-4">
          {deleteSuccessMessage}
        </div>
      )}
    </div>
  );
};

export default Contacts;