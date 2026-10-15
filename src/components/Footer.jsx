import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-3">✨</span>
              <span className="navbar-brand-logo fs-4">EventHive</span>
            </div>
            <p className="text-secondary small pe-lg-4">
              EventHive is your end-to-end event management partner. From fairytale weddings and milestone anniversaries to cutting-edge corporate tech galas, we deliver bespoke, flawless experiences.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <a href="#instagram" className="text-secondary hover-warning"><i className="bi bi-instagram"></i></a>
              <a href="#facebook" className="text-secondary hover-warning"><i className="bi bi-facebook"></i></a>
              <a href="#linkedin" className="text-secondary hover-warning"><i className="bi bi-linkedin"></i></a>
              <a href="#youtube" className="text-secondary hover-warning"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Quick Links</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/packages" className="text-secondary text-decoration-none">All Packages</Link></li>
              <li><Link to="/book" className="text-secondary text-decoration-none">Book Inquiry</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">About Us</Link></li>
              <li><Link to="/admin/login" className="text-secondary text-decoration-none">Admin Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Event Categories</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/packages?category=Weddings" className="text-secondary text-decoration-none">Weddings & Receptions</Link></li>
              <li><Link to="/packages?category=Corporate Events" className="text-secondary text-decoration-none">Corporate Summits</Link></li>
              <li><Link to="/packages?category=Birthdays" className="text-secondary text-decoration-none">Birthday Galas</Link></li>
              <li><Link to="/packages?category=Anniversaries" className="text-secondary text-decoration-none">Anniversary Dinners</Link></li>
              <li><Link to="/packages?category=Concerts & Galas" className="text-secondary text-decoration-none">Concerts & Festivals</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Headquarters</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li className="d-flex gap-2">
                <i className="bi bi-geo-alt-fill text-warning"></i>
                <span>100 Innovation Way, Suite 400, San Francisco, CA</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-telephone-fill text-warning"></i>
                <span>+1 (800) 555-HIVE (4483)</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-envelope-fill text-warning"></i>
                <span>inquiries@eventhive.com</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-clock-fill text-warning"></i>
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small gap-2">
          <span>&copy; {new Date().getFullYear()} EventHive Technologies Inc. All rights reserved.</span>
          <span className="text-muted">Built with MERN Stack (MongoDB, Express, React, Node.js) & Bootstrap 5</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

