import React from 'react';
import { Link } from 'react-router-dom';

const profile1 = {
    profilePic: "https://media.istockphoto.com/id/1279504799/photo/businesswomans-portrait.jpg?s=612x612&w=0&k=20&c=I-54ajKgmxkY8s5-myHZDv_pcSCveaoopf1DH3arv0k=",
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "12-10-1990",
    email: "jane.doe@gmail.com",
    phone: "123-456-7890",
    gender: "Female",
    streetAddress: "123 Town Street",
    aptNumber: "",  
    postal: "A1B 2C3",
    city: "Toronto",
    province: "ON"
}

function Profile({profilePic, firstName, lastName, dateOfBirth, email, phone, gender, streetAddress, aptNumber, postal, city, province}) {
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
                        <img className="profile-pic" src="https://media.istockphoto.com/id/1279504799/photo/businesswomans-portrait.jpg?s=612x612&w=0&k=20&c=I-54ajKgmxkY8s5-myHZDv_pcSCveaoopf1DH3arv0k=" alt="Profile" />
                    </div>
                    <div className="profile-details">
                        <h2>{profile1.firstName + " " + profile1.lastName}</h2>
                        <p>{profile1.email}</p>
                        <p>{profile1.phone}</p>
                        <p>{profile1.city + " " + profile1.province}</p>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <div className="personal-info">
                    <h3>Personal Information</h3>
                    <div className="details">
                        <div className="info-box">
                            <p>First Name</p>
                            <p>{profile1.firstName}</p>
                        </div>
                        <div className="info-box">
                            <p>Last Name</p>
                            <p>{profile1.lastName}</p>
                        </div>
                        <div className="info-box">
                            <p>Date of Birth</p>
                            <p>{profile1.dateOfBirth}</p>
                        </div>
                        <div className="info-box">
                            <p>Email Address</p>
                            <p>{profile1.email}</p>
                        </div>
                        <div className="info-box">
                            <p>Phone Number</p>
                            <p>{profile1.phone}</p>
                        </div>
                        <div className="info-box">
                            <p>Gender</p>
                            <p>{profile1.gender}</p>
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
                            <p>{profile1.streetAddress}</p>
                        </div>
                        <div className="info-box">
                            <p>Apt Number</p>
                            <p>{profile1.aptNumber}</p>
                        </div>
                        <div className="info-box">
                            <p>Postal Code</p>
                            <p>{profile1.postal}</p>
                        </div>
                        <div className="info-box">
                            <p>City</p>
                            <p>{profile1.city}</p>
                        </div>
                        <div className="info-box">
                            <p>Province</p>
                            <p>{profile1.province}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;