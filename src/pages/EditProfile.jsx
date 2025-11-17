import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const provinces = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU",
  "ON", "PE", "QC", "SK", "YT"
];

const initialProfile = {
  profilePic: "https://media.istockphoto.com/id/1279504799/photo/businesswomans-portrait.jpg?s=612x612&w=0&k=20&c=I-54ajKgmxkY8s5-myHZDv_pcSCveaoopf1DH3arv0k=",
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: "1990-12-10",
  email: "jane.doe@gmail.com",
  phone: "123-456-7890",
  gender: "Female",
  streetAddress: "123 Town Street",
  aptNumber: "",
  postal: "A1B 2C3",
  city: "Toronto",
  province: "ON"
};

function EditProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validators
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/.test(phone);

  const validatePostal = (postal) =>
    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postal);

  // Input handler
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile({ ...profile, profilePic: url });
  };

  // SAVE (no database yet)
  const handleSave = () => {
    const newErrors = {};

    if (!validateEmail(profile.email)) newErrors.email = "Invalid email.";
    if (!validatePhone(profile.phone)) newErrors.phone = "Invalid phone number.";
    if (!validatePostal(profile.postal)) newErrors.postal = "Invalid postal code.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    alert("Profile saved successfully!");
    navigate("/profile", { state: { updatedProfile: profile } });
  };

  return (
    <div className="edit-profile-page">
      <div className="header-section">
        <h1>Edit Profile</h1>
      </div>

      <div className="button-section">
        <Link to="/profile">
          <button className="button-styling">Cancel</button>
        </Link>
        <button className="button-styling" onClick={handleSave}>Save</button>
      </div>

      <div className="main-section">

        <div className="content-section">
          <div className="profile-overview">
            <div>
              <img 
                className="profile-pic"
                src={profile.profilePic}
                alt="Profile"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

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
                <input 
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>

              <div className="info-box">
                <p>Last Name</p>
                <input 
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <p>Date of Birth</p>
                <input 
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <p>Email Address</p>
                <input 
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="info-box">
                <p>Phone Number</p>
                <input 
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="info-box">
                <p>Gender</p>
                <select 
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
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
                <input 
                  name="streetAddress"
                  value={profile.streetAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <p>Apt Number</p>
                <input 
                  name="aptNumber"
                  value={profile.aptNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <p>Postal Code</p>
                <input 
                  name="postal"
                  value={profile.postal}
                  onChange={handleChange}
                />
                {errors.postal && <span className="error">{errors.postal}</span>}
              </div>

              <div className="info-box">
                <p>City</p>
                <input 
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <p>Province</p>
                <select
                  name="province"
                  value={profile.province}
                  onChange={handleChange}
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EditProfile;