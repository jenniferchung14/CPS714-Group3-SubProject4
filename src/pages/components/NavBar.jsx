import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, getUserProfile, getActiveMockUid } from "../../services/firebase"; // adjust path

export default function NavBar() {
  const [profile, setProfile] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        const userId = user?.uid ?? getActiveMockUid();
        if (!mounted) return;
        setUid(userId);
        const data = await getUserProfile(userId);
        if (mounted) setProfile(data);
      } catch (err) {
        console.error('NavBar: failed to load profile', err);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     // If a real user is logged in → load their UID
  //     if (user) {
  //       setUid(user.uid);
  //       const data = await getUserProfile(user.uid);
  //       setProfile(data);
  //     } 
  //     // If no user is logged in → load DEFAULT USER (User 1)
  //     else {
  //       const defaultUID = "u_jane"; // your default user
  //       setUid(defaultUID);
  //       const data = await getUserProfile(defaultUID);
  //       setProfile(data);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  if (!profile) {
    return (
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/Catalog" className="nav-item">Catalog</Link>
          <Link to="/Reservation" className="nav-item">Reservation</Link>
        </div>

        <div className="nav-profile">
          <img src="https://via.placeholder.com/32" alt="Profile"/>
          <span>Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-item">Dashboard</Link>
        <Link to="/Catalog" className="nav-item">Catalog</Link>
        <Link to="/Reservation" className="nav-item">Reservation</Link>
      </div>

      <div className="nav-profile">
        <img
          src={profile.profilePic || "https://via.placeholder.com/32"}
          alt="Profile"
          className="profile-icon"
        />

        <span className="profile-name">{profile.firstName}</span>
        <span className="profile-arrow">▾</span>

        <div className="profile-menu">
          <Link to={`/profile/${uid}`} className="profile-menu-item">
            View Profile
          </Link>
          <Link to={`/editProfile/${uid}`} className="profile-menu-item">
            Edit Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
