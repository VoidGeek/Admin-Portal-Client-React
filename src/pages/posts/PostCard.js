import React from 'react';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';

function PostCard({ post, image, loading }) {
  const formattedDate = format(new Date(post.submittedAt), 'MMMM d, yyyy');

  return (
    <div className="my-4" style={{ maxWidth: '500px' }}>
      <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg shadow-lg p-6">
        {loading ? (
          <Skeleton height={256} />
        ) : (
          <>
            <div className="flex items-center mb-4">
              {/* Display "Admin" instead of the admin user information and a dummy profile logo */}
              <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4"></div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {loading ? <Skeleton width={120} /> : 'Admin'}
                </h2>
                <div className="text-sm text-gray-200">
                  {loading ? (
                    <Skeleton width={100} />
                  ) : (
                    `Posted on: ${formattedDate}`
                  )}
                </div>
              </div>
            </div>
            {image && (
              <div className="h-96 rounded overflow-hidden mb-4 mx-auto flex justify-center">
                <img
                  src={image.imageUrl}
                  alt="Post"
                  className="w-full h-full object-cover square-image"
                   // Limit the maximum height
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-4">
              {loading ? <Skeleton width={180} /> : post.caption}
            </h2>
          </>
        )}
      </div>
    </div>
  );
}

export default PostCard;
