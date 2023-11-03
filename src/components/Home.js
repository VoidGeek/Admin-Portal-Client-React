import React, { useEffect, useState } from 'react';
import TestimonialCard from '../pages/testimonials/TestimonialCard';
import TestimonialService from '../services/testimonial.service';
import TestimonialSkeletonCard from './TestimonialSkeletonCard'; 
import ImageService from '../services/image.service';
import ProjectService from '../services/project.service';
import ProjectCard from '../pages/projects/ProjectCard';
import { Carousel } from 'react-responsive-carousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import { Link } from 'react-router-dom';

SwiperCore.use([Navigation, Pagination]);



const WelcomeSection = () => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <section className="h-screen bg-gradient-to-b from-green-100 to-blue-100 text-black flex justify-center items-center relative overflow-x-hidden">
      <div className="absolute bg-gradient-to-b from-red-100 to-blue-200 shadow-md mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-full text-center md:text-left md:pr-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Explore Our Website
          </h2>
          <Link to="/contactUs">
            <button className="relative bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-4 text-base md:text-lg lg:text-xl hover:from-green-600 hover:to-green-400 transition-transform duration-500 ease-in-out hover:-translate-y-2 overflow-hidden group">
              <span className="relative z-10">Feel Free to Ask</span>
              <span className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-green-200 via-green-300 to-green-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
            </button>
          </Link>
        </div>
        <div className="md:w-full text-center relative">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <img
              src="/circle.png"
              alt="Circle Logo"
              className="absolute w-1/3 md:w-1/4 lg:w-1/6 h-auto object-cover object-center transform scale-x-[-1] transition-transform duration-500 ease-in-out hover:-translate-y-4"
            />
            {imageLoading ? (      
            <div className="fixed top-0 left-0 w-full h-full bg-gray-300 animate-pulse object-cover object-center transform scale-x-[-1] transition-transform duration-500 ease-in-out hover:-translate-y-4 z-50"></div>
            ) : null}
            <img
              src="/banner(1).webp"
              alt="Company Logo"
              className={`object-cover object-center transform scale-x-[-1] transition-transform duration-500 ease-in-out hover:-translate-y-4 mt-4 md:mt-8 ${
                imageLoading ? 'hidden' : 'block'
              }`}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


const WelcomeSectionSkeleton = () => {
  return (
    <section className="h-screen bg-gradient-to-b from-green-100 to-blue-100 text-black flex justify-center items-center relative overflow-x-hidden">
      <div className="absolute bg-gradient-to-b from-red-100 to-blue-200 shadow-md mx-auto flex flex-col md:flex-row items-center w-full h-full">
        <div className="md:w-full text-center md:text-left md:pr-8">
          <div className="animate-pulse text-2xl md:text-3xl lg:text-4xl font-bold h-10 w-60 bg-gray-300 rounded-full mb-4"></div>
          <div className="animate-pulse h-12 w-44 bg-gray-300"></div>
        </div>
        <div className="md:w-full text-center relative">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <div className="animate-pulse absolute w-1/3 md:w-1/4 lg:w-1/6 h-auto object-cover object-center transform scale-x-[-1] transition-transform duration-500 ease-in-out hover:-translate-y-4"></div>
            <div className="animate-pulse object-cover object-center transform scale-x-[-1] transition-transform duration-500 ease-in-out hover:-translate-y-4 mt-4 md:mt-8"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkeletonCard = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="flex items-start">
        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mr-4"></div>
        <div>
          <div className="flex items-center mb-2">
            <div className="mr-2">
              <span className="bg-gray-300 h-8 w-8 animate-pulse rounded-full"></span>
              <span className="bg-gray-300 h-8 w-8 animate-pulse rounded-full"></span>
              <span className="bg-gray-300 h-8 w-8 animate-pulse rounded-full"></span>
              <span className="bg-gray-300 h-8 w-8 animate-pulse rounded-full"></span>
              <span className="bg-gray-300 h-8 w-8 animate-pulse rounded-full"></span>
            </div>
          </div>
          <div className="bg-gray-300 h-6 w-1/2 mx-auto animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    Promise.all([
      TestimonialService.getAllTestimonials(),
      ProjectService.getAllProjects(),
      ImageService.getAllImages(),
    ])
      .then(([testimonials, projects, imageData]) => {
        setAllTestimonials(testimonials);
        setAllProjects(projects);
        setImages(imageData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      {loading ? (
        <WelcomeSectionSkeleton />
      ) : (
        <WelcomeSection />
      )}
      <section className="py-16 bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Projects</h2>
          {loading ? (
            Array(3)
              .fill()
              .map((_, index) => <SkeletonCard key={index} />)
          ) : (
            <Carousel
              showArrows={true} // Show navigation arrows
              autoPlay={true} // Enable auto-play
              interval={5000} // Set auto-play interval (in milliseconds)
              infiniteLoop={true} // Enable infinite loop
              stopOnHover={false} // Disable auto-play on hover
            >
              {allProjects.map((project) => {
                const matchingImage = images.find(
                  (image) => image.s3Key === project.project_image
                );
                return (
                  <ProjectCard key={project._id} project={project} image={matchingImage} />
                );
              })}
            </Carousel>
          )}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-blue-300 to-grey-300">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
        {loading ? ( // Render the skeleton cards while loading
          <div className="flex flex-wrap justify-center">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index}>
                <TestimonialSkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            navigation={true}
            pagination={{ clickable: true }}
            onInit={(swiper) => {
              swiper.on('resize', () => {
                const slidesPerView = window.innerWidth < 640 ? 2 : 3;
                swiper.params.slidesPerView = slidesPerView;
                swiper.update();
              });
            }}
          >
            {allTestimonials.map((testimonial) => {
              const matchingImage = images.find((image) => image.s3Key === testimonial.test_image);
              return (
                <SwiperSlide key={testimonial._id}>
                  <TestimonialCard testimonial={testimonial} image={matchingImage} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
    </div>
  );
};

export default Homepage;
