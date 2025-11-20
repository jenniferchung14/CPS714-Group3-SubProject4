import { useState } from "react";

import '../styles/NavBar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="logo">MySite</div>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Slide-in Menu */}
      <div className={`menu ${open ? "open" : ""}`}>
        <a href="#">Catalog</a>
        <a href="#">Library</a>
        <a href="#">Profile</a>
        <a href="#">Contact</a>
      </div>

      {/* Background dim when menu is open */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}