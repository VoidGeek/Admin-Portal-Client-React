import React, { useState, useEffect } from "react";
import ImageService from "../services/image.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const YourComponent = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [loading, setLoading] = useState(false); // State for tracking loading state
  

  useEffect(() => {
    // Fetch all images when the component mounts
    ImageService.getAllImages()
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const handleImageUpload = () => {
    if (selectedImage) {
      setLoading(true); // Set loading to true during the upload or update

      const formData = new FormData();
      formData.append("image", selectedImage);

      if (selectedImageKey) {
        // If an image key is selected, it means you want to update an existing image
        ImageService.updateImage(selectedImageKey, formData)
          .then((updatedImage) => {
            // Find the updated image in the state and replace it
            const updatedImages = images.map((image) =>
              image.s3Key === selectedImageKey ? updatedImage : image
            );
            setImages(updatedImages);
          })
          .catch((error) => {
            console.error("Error updating image:", error);
          })
          .finally(() => {
            setLoading(false); // Reset loading when the operation is complete
          });
      } else {
        // If no image key is selected, it means you want to create a new image
        ImageService.uploadImage(formData)
          .then((uploadedImage) => {
            setImages([...images, uploadedImage]);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          })
          .finally(() => {
            setLoading(false); // Reset loading when the operation is complete
          });
      }

      // Reset the selected image and key
      setSelectedImage(null);
      setSelectedImageKey(null);
    }
  };

  const handleImageDelete = (s3Key) => {
    setLoading(true); // Set loading to true during the delete

    ImageService.deleteImage(s3Key)
      .then(() => {
        setImages(images.filter((image) => image.s3Key !== s3Key));
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      })
      .finally(() => {
        setLoading(false); // Reset loading when the operation is complete
      });
  };

  const handleImageUpdate = (image) => {
    // Set the selected image and its key to perform an update
    setSelectedImage(image);
    setSelectedImageKey(image.s3Key);
  };

 

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <label htmlFor="image" className="text-lg font-semibold">
          Upload or Update Image:
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
        <button
          onClick={handleImageUpload}
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md ml-2"
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : selectedImageKey ? (
            "Update"
          ) : (
            "Upload"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.s3Key} className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-4">
              <img src={image.imageUrl} alt={image.name} className="h-full w-full object-cover rounded-md" />
              <div className="text-center my-2">
                <h5 className="text-xl font-semibold mb-2">{image.name}</h5>
                <button
                  onClick={() => handleImageDelete(image.s3Key)}
                  className="text-white bg-red-500 hover-bg-red-600 px-4 py-2 rounded-md"
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => handleImageUpdate(image)}
                  className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md ml-2"
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourComponent;


