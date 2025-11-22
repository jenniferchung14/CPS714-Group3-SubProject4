import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import LibraryTable from "../components/LibraryTable.jsx";
import { getActiveMockUid } from "../services/firebase.js";
import Navbar from "../components/NavBar.jsx";

import "../styles/App.css";
import "../styles/Profile.css";
import "../styles/EditProfile.css";
import "../styles/components/NavBar.css";
import "../styles/components/LibraryTable.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="library-page">
                  <div className="profile-header">
                    <h1>My Books</h1>
                  </div>
                  <div className="content-section">
                    <div className="borrowed-books-section">
                      <h3>Borrow History</h3>
                      <LibraryTable />
                    </div>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/editProfile/:uid" element={<EditProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
