import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, getUserProfile, getActiveMockUid } from "../services/firebase"; // adjust path

export default function NavBar() {
  const [profile, setProfile] = useState(null);
  const [uid, setUid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Prefer a uid from the URL path (/profile/:uid) or query (?uid=)
    // and load that profile. Only when neither is present do we subscribe
    // to auth so the navbar shows the signed-in (or active mock) user.
    const params = new URLSearchParams(location.search);
    const uidFromQuery = params.get("uid");
    const pathMatch = location.pathname.match(/^\/profile\/(.+)$/);
    const uidFromPath = pathMatch ? decodeURIComponent(pathMatch[1]) : null;

    const uidToLoad = uidFromPath || uidFromQuery;

    if (uidToLoad) {
      let mounted = true;
      (async () => {
        try {
          const data = await getUserProfile(uidToLoad);
          if (!mounted) return;
          setUid(uidToLoad);
          setProfile(data);
        } catch (err) {
          console.error('NavBar: failed to load profile from URL', err);
        }
      })();

      return () => {
        mounted = false;
      };
    }

    // No uid in path or query — fall back to auth / active mock uid subscription.
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
  }, [location.pathname, location.search]);

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

  // If the current URL is a profile page (e.g. /profile/user#), prefer that
  // UID when building the Dashboard link so navigation keeps context.
  const pathMatch = window.location.pathname.match(/^\/profile\/(.+)$/);
  const uidFromPath = pathMatch ? pathMatch[1] : null;

  const dashboardUid = uidFromPath || uid;

  if (!profile) {
    return (
      <nav className="navbar">
        <div className="nav-left">
          <Link to={dashboardUid ? `/?uid=${dashboardUid}` : "/"} className="nav-item">Dashboard</Link>
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
        <Link to={dashboardUid ? `/?uid=${dashboardUid}` : "/"} className="nav-item">Dashboard</Link>
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
