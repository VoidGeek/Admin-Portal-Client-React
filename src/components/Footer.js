import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  // Define the URLs for your social media pages
  const facebookUrl = "https://www.facebook.com/your-facebook-page";
  const twitterUrl = "https://twitter.com/your-twitter-page";
  const instagramUrl = "https://www.instagram.com/your-instagram-page";
  const linkedinUrl = "https://www.linkedin.com/company/your-linkedin-page";

  return (
    <footer className="bg-gradient-to-r from-green-200 to-custom-pink custom-gradient-bg">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="mt-4">
            <h4 className="text-dark">
              <Link to="/about-us">About Us</Link>
            </h4>
            <p>Your about us content goes here.</p>
            <div className="social-media-buttons">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-light w-10 h-10 mr-4">
                  <FontAwesomeIcon icon={faFacebookF} className="text-black text-sm" />
                </button>
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-light w-10 h-10 mr-4">
                  <FontAwesomeIcon icon={faTwitter} className="text-black text-sm" />
                </button>
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-light w-10 h-10 mr-4">
                  <FontAwesomeIcon icon={faInstagram} className="text-black text-sm" />
                </button>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-light w-10 h-10">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-black text-sm" />
                </button>
              </a>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-dark">
              <Link to="/contactUs">Contact Us</Link>
            </h4>
            <p>Your contact information goes here.</p>
          </div>
          <div className="mt-4">
            <h4>Information</h4>
            <p className="address">
              123 abc Main Street Los Angeles, CA 90001, United States
              <br />
              +91 12345 12345
              <br />
              <a href="mailto:yourcompany@gmail.com" className="text-dark">yourcompany@gmail.com</a>
            </p>
          </div>
          <div className="mt-4">
            <form>
              <div className="flex">
                <input type="email" className="form-control" id="subscribeEmail" placeholder="Your Email" />
                <button type="submit" className="btn btn-primary ml-2">Subscribe</button>
              </div>
              <p className="mt-2">Stay up-to-date on the latest news and events by subscribing to our newsletter.</p>
            </form>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center mt-4">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
