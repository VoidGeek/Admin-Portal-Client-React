import React, { useState, useEffect } from 'react';
import PostService from '../../services/post.service';
import ImageService from '../../services/image.service';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [post, setPost] = useState({
    caption: '',
    post_image: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the existing post data for editing
    PostService.getPostById(id)
      .then((fetchedPost) => {
        setPost(fetchedPost);

        // If the post has a post_image (s3Key), fetch the image
        if (fetchedPost.post_image) {
          ImageService.getImageByKey(fetchedPost.post_image)
            .then((image) => {
              setSelectedImage(image); // Set the fetched image as the selected image
              setSelectedImageKey(fetchedPost.post_image); // Set the image key
            })
            .catch((error) => {
              console.error('Error fetching image:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
      });
  }, [id]);

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedImage) {
        setLoading(true); // Set loading to true during the upload or update

        const formData = new FormData();
        formData.append('image', selectedImage);

        if (selectedImageKey) {
          // If an image key is selected, it means you want to update an existing image
          ImageService.updateImage(selectedImageKey, formData)
            .then((updatedImage) => {
              // Update the post image
              const updatedImages = [...images, updatedImage];
              setImages(updatedImages);

              // Update the post state with the new s3Key
              setPost((prevPost) => ({
                ...prevPost,
                post_image: updatedImage.s3Key,
              }));

              alert('Image updated successfully!');
              setStep(2);
            })
            .catch((error) => {
              alert('Error updating image: ' + error.message);
            })
            .finally(() => {
              setLoading(false); // Reset loading when the operation is complete
            });
        } else {
          // If no image key is selected, it means you want to create a new image
          ImageService.uploadImage(formData)
            .then((uploadedImage) => {
              setImages([...images, uploadedImage]);

              // Set the s3Key for the uploaded image in the post state
              setPost((prevPost) => ({
                ...prevPost,
                post_image: uploadedImage.s3Key,
              }));

              alert('Image uploaded successfully and associated with the post!');
              setStep(2);
            })
            .catch((error) => {
              alert('Error uploading image:' + error.message);
            })
            .finally(() => {
              setLoading(false); // Reset loading when the operation is complete
            });
        }

        // Reset the selected image and key
        setSelectedImage(null);
        setSelectedImageKey(null);
      } else {
        alert('Please select an image to upload.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedPost = await PostService.updatePost(id, post);

      if (updatedPost) {
        alert('Post updated successfully!');
        navigate('/admin/posts');
      } else {
        alert('Error updating the post.');
      }
    } catch (error) {
      alert('Error updating the post: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        {step === 1 ? (
          // Step 1: Image Update
          <div>
            <h1 className="text-2xl font-bold mb-4">Update Post Image</h1>
            <form>
              <div className="mb-4">
                <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700">
                  Select New Image:
                </label>
                <input
                  type="file"
                  id="selectedImage"
                  name="selectedImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {selectedImage ? (
                  <p>Selected Image: {selectedImage.name}</p>
                ) : (
                  <p>No file chosen</p>
                )}
              </div>
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Uploading...' : selectedImageKey ? 'Update' : 'Upload'}
              </button>
            </form>
            <button
              onClick={() => setStep(2)}
              className="text-blue-500 mt-2 hover:underline cursor-pointer"
            >
              Skip this step
            </button>
          </div>
        ) : (
          // Step 2: Post Update
          <div>
            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
            <form>
              {/* Rest of the form for updating post details */}
              <div className="mb-4">
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                  Post Caption:
                </label>
                <input
                  type="text"
                  id="caption"
                  name="caption"
                  value={post.caption}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                />
              </div>
              <button
                onClick={handlePostUpdate}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPost;
