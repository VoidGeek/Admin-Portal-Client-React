import React, { useState, useEffect } from 'react';
import PostService from '../../services/post.service';
import ImageService from '../../services/image.service';
import PostCard from './PostCard';
import AuthService from '../../services/auth.service';
import NotFoundPage from '../NotFoundPage';
import { Link } from 'react-router-dom';

const currentUser = AuthService.getCurrentUser();

function AddPost() {
  const [post, setPost] = useState({
    caption: '',
    post_image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        ImageService.uploadImage(formData)
          .then((uploadedImage) => {
            if (uploadedImage.s3Key) {
              setImages([...images, uploadedImage]);
              setPost({ ...post, post_image: uploadedImage.s3Key });
              alert('Image uploaded and associated with the post!');
              setStep(2);
            } else {
              alert('Error uploading the image.');
            }
          })
          .catch((error) => {
            alert('Error uploading the image: ' + error.message);
          });
      } else {
        alert('Please select an image to upload.');
      }
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdPost = await PostService.createPost(post);

      if (createdPost) {
        alert('Post submitted successfully!');
        // Reset the form or perform any other actions
      } else {
        alert('Error creating the post.');
      }
    } catch (error) {
      alert('Error creating the post: ' + error.message);
    }
  };

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    PostService.getAllPosts()
      .then((posts) => {
        setAllPosts(posts);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  useEffect(() => {
    ImageService.getAllImages()
      .then((imageData) => {
        setImages(imageData);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  const handlePostDelete = async (postId, postImageS3Key) => {
    try {
      if (postImageS3Key) {
        await ImageService.deleteImage(postImageS3Key);
      }

      await PostService.deletePost(postId);

      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );

      alert('Post deleted successfully!');
    } catch (error) {
      alert('Error deleting the post: ' + error.message);
    }
  };

  if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
    return <NotFoundPage />;
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-grey-300">
      <div className="container mx-auto mt-8 p-4">
      <div className="w-full p-6 bg-opacity-70 backdrop-blur-100 rounded-lg shadow-md">
        <h1 className="text-2xl text-center font-bold mb-4">
          {step === 1 ? 'Step 1:' : 'Step 2: Enter Post Details'}
        </h1>
        {step === 1 && (
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Upload Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {step === 1 ? 'Next' : 'Submit Post'}
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                Caption:
              </label>
              <input
                type="text"
                id="caption"
                name="caption"
                value={post.caption}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent bg-opacity-70 backdrop-blur-100"
                required
              />
            </div>
            <div className="mb-4">
              <button
                onClick={handlePostSubmit}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit Post
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 "style={{ maxWidth: '500px' }}>
          <h2 className="text-xl font-bold mb-4">All Posts</h2>
          {allPosts
            .filter((post) => currentUser.id === post.adminUser) // Filter by adminUser
            .map((post) => {
              const matchingImage = images.find((image) => image.s3Key === post.post_image);
              return (
                <div key={post._id} className="mb-4 border border-gray-300 p-4 rounded">
                  <PostCard post={post} image={matchingImage} />
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() =>
                        handlePostDelete(post._id, matchingImage.s3Key)
                      }
                      className="text-white bg-gradient-to-r from-red-400 to-red-600 hover:from-red-600 hover:to-red-800 mx-2 py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                    <Link to={`/admin/feeds/${post._id}/edit`} className="text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-800 mx-2 py-1 px-3 rounded">
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
    </div>
  );
}

export default AddPost;
