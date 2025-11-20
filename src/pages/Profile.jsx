import React from 'react';
import { Link } from 'react-router-dom';

import { useEffect, useState } from "react";
import { auth, getUserProfile } from "../services/firebase.js"; 

function Profile({profilePic, firstName, lastName, dateOfBirth, email, phone, gender, streetAddress, aptNumber, postal, city, province}) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function load() {
            // const uid = auth.currentUser?.uid;
            // if (!uid) return;

            // uid hardcoded for testing purposes
            const uid = "u_jane";

            const data = await getUserProfile(uid);
            setProfile(data);
        }
        load();
    }, []);

    if (!profile) return <p>Loading Profile...</p>;

    return (
    <div className="profile-page">
        <div className="header-section">
            <h1>My Profile</h1>
        </div>

        <div className="button-section">
            {/* <Link to="/resetPassword">
                <button className="button-styling">Reset Password</button>
            </Link> */}
            <Link to="/editProfile">
                 <button className="button-styling">Edit Profile</button>
            </Link>
        </div>

        <div className='main-section'>
            <div className="content-section">
                <div className="profile-overview">
                    <div>
                        <img 
                            className="profile-pic" 
                            src={profile.profilePic}
                            alt="Profile" 
                        />                    </div>
                    <div className="profile-details">
                        <h2>{profile.firstName} {profile.lastName}</h2>
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                        <p>{profile.city} {profile.province}</p>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <div className="personal-info">
                    <h3>Personal Information</h3>
                    <div className="details">
                        <div className="info-box">
                            <p>First Name</p>
                            <p>{profile.firstName}</p>
                        </div>
                        <div className="info-box">
                            <p>Last Name</p>
                            <p>{profile.lastName}</p>
                        </div>
                        <div className="info-box">
                            <p>Date of Birth</p>
                            <p>{profile.dateOfBirth}</p>
                        </div>
                        <div className="info-box">
                            <p>Email Address</p>
                            <p>{profile.email}</p>
                        </div>
                        <div className="info-box">
                            <p>Phone Number</p>
                            <p>{profile.phone}</p>
                        </div>
                        <div className="info-box">
                            <p>Gender</p>
                            <p>{profile.gender}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <div className="address-info">
                    <h3>Address</h3>
                    <div className="details">
                        <div className="info-box">
                            <p>Street Address</p>
                            <p>{profile.streetAddress}</p>
                        </div>
                        <div className="info-box">
                            <p>Apt Number</p>
                            <p>{profile.aptNumber}</p>
                        </div>
                        <div className="info-box">
                            <p>Postal Code</p>
                            <p>{profile.postal}</p>
                        </div>
                        <div className="info-box">
                            <p>City</p>
                            <p>{profile.city}</p>
                        </div>
                        <div className="info-box">
                            <p>Province</p>
                            <p>{profile.province}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;