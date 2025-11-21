import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import LibraryTable from "./components/LibraryTable.jsx";
import Navbar from './NavBar.jsx';

import "../styles/App.css";
import "../styles/Profile.css";
import "../styles/EditProfile.css";
import "../styles/components/LibraryTable.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p> */}

                <div className="library-page">
                  <div className="main-section">
                    <h1>Put the main library page here</h1>
                    <Link to="/profile">
                      <button className="btn-profile">
                        <span>Profile</span>
                      </button>
                    </Link>
                    <div className="content-section">
                      <div className="borrowed-books-section">
                        <h3>My Borrowed Books</h3>
                        <LibraryTable />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editProfile" element={<EditProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
