// App.js

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardAdmin from "./components/BoardAdmin";
import BoardModerator from "./components/BoardModerator";
import Contacts from "./components/Contacts";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventBus from "./common/EventBus";
import ContactUs from "./pages/ContactUs";
import YourComponent from "./pages/imageUpload";
import Testimonial from "./pages/testimonials/testimonial";
import UserList from "./pages/userList";
import EditTestimonial from "./pages/testimonials/EditTestimonial";
import AddProject from "./pages/projects/project";
import EditProject from "./pages/projects/EditProject";
import AddService from "./pages/services/service";
import EditService from "./pages/services/EditService";
import AddPost from "./pages/posts/post";
import EditPost from "./pages/posts/EditPost";
import FeedList from "./components/FeedList";
import ServiceList from "./components/ServiceList"
import ResetPass from "./common/ResetPass";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div className>
      <Navbar
  currentUser={currentUser}
  logOut={logOut}
  showAdminBoard={showAdminBoard}
  showModeratorBoard={showModeratorBoard} // New prop for moderators
/>

      <div>
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/home"} element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/admin" element={<BoardAdmin />} />
          <Route path="/moderator" element={<BoardModerator />} />
          <Route exact path="/admin/contacts" element={<Contacts />} />
          <Route exact path="/contactUs" element={<ContactUs />} />
          <Route exact path="/upload" element={<YourComponent />} />
          <Route exact path="/project/:project/update" element={<projectForm />} />
          <Route exact path="/admin/testimonials" element={<Testimonial />} />
          <Route exact path="/moderator/userList" element={<UserList />} />
          <Route exact path="/admin/testimonials/:id/edit" element={<EditTestimonial />} />
          <Route exact path="/admin/projects/:id/edit" element={<EditProject />} />
          <Route exact path="/admin/projects" element={<AddProject />} />
          <Route exact path="/admin/services" element={<AddService />} />
          <Route exact path="/admin/services/:id/edit" element={<EditService />} />
          <Route exact path="/admin/posts" element={<AddPost />} />
          <Route exact path="/admin/feeds/:id/edit" element={<EditPost />} />
          <Route exact path="/home/feeds" element={<FeedList />} />
          <Route exact path="/home/services" element={<ServiceList />} />
          <Route exact path="/login/reset" element={<ResetPass />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
