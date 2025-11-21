import React from "react";
import "../styles/NavBar.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-item">
          Dashboard
        </Link>
        <Link to="/Catalog" className="nav-item">
          Catalog
        </Link>
        <Link to="/Reservation" className="nav-item">
          Reservation
        </Link>
      </div>

      {/* profile area */}
      <div className="nav-profile">
        <img
          src="https://via.placeholder.com/32"
          alt="Profile"
          className="profile-icon"
        />

        <span className="profile-name">Jessica</span>
        <span className="profile-arrow">▾</span>

        {/* dropdown box (shown on hover via CSS) */}
        <div className="profile-menu">
          <Link to="/Profile" className="profile-menu-item">
            View Profile
          </Link>
          <Link to="/EditProfile" className="profile-menu-item">
            Edit Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
