import React from 'react';

function ProjectCard({ project, image }) {
  const startDate = new Date(project.startDate).toLocaleDateString();
  const endDate = new Date(project.endDate).toLocaleDateString();

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative">
      <div className="relative">
        {image && (
          <img
            src={image.imageUrl}
            alt="Project"
            className="object-cover w-full h-64 rounded-t-lg"
          />
        )}
        <div className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded-bl-lg">
          New
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-purple-200 to-white relative">
        <div className="absolute top-0 right-0 p-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
          {startDate} - {endDate}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-black mb-2">
          {project.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
       
      </div>
    </div>
  );
}

export default ProjectCard;
