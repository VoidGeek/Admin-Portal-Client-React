import React, { useEffect, useState } from 'react';
import PostCard from '../pages/posts/PostCard';
import PostService from '../services/post.service';
import ImageService from '../services/image.service';

// A component for displaying a skeleton loading card
const SkeletonCard = () => {
  return (
    <div className="my-4">
      <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg shadow-lg p-4">
        <div className="w-72 h-72 rounded overflow-hidden mb-4 mx-auto bg-gray-300"></div>
        <h2 className="text-xl font-bold mb-2">
          <div className="bg-gray-300 h-8 w-72 animate-pulse mb-2"></div>
        </h2>
        <div className="text-white">
          <p className="text-sm text-gray-200 mb-2">
            Posted on: <span className="bg-gray-300 w-100 h-6 animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

// A component for displaying a single post card
const SinglePostCard = ({ post, image }) => {
  return (
    <div className="max-w-xs mb-4 md:w-1/2 md:p-2">
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1"> {/* Create a 1:1 aspect ratio container */}
          <div className="absolute inset-0">
            <PostCard post={post} image={image} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  useEffect(() => {
    // Fetch posts and images when the component mounts
    Promise.all([
      PostService.getAllPosts(),
      ImageService.getAllImages(),
    ])
      .then(([posts, imageData]) => {
        // Sort posts by submission time in descending order (latest first)
        posts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setAllPosts(posts);
        setImages(imageData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Handle keyboard navigation for posts
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (currentPostIndex < allPosts.length - 1) {
        setCurrentPostIndex(currentPostIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (currentPostIndex > 0) {
        setCurrentPostIndex(currentPostIndex - 1);
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-300 to-grey-300">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">FEEDS</h2>
        <div className="flex flex-col items-center">
          {loading ? (
            // Render skeleton loading cards while data is loading
            Array(3).fill().map((_, index) => (
              <div key={index} className="flex space-x-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ))
          ) : (
            // Render actual post cards when data is available
            <div className="md:flex md:flex-row md:flex-wrap">
              {allPosts.map((post, index) => (
                <div key={post._id} className="max-w-xs mb-4 md:w-1/2 md:p-2">
                  <div className> {/* Add margin to create a gap */}
                    <PostCard
                      post={post}
                      image={images.find((image) => image.s3Key === post.post_image)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
