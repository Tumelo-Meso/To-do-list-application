// LandingPage.jsx
import React from "react";
import "./css/LandingPage.css"; // We'll style with an external CSS file
import { Link } from "react-router-dom";
import Footer from "./components/footer.jsx";
const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Stay Organized, Achieve More</h1>
        <p className="hero-subtitle">
          Manage your tasks, track your progress, and boost your productivity.
        </p>
        <Link to="/auth" className="cta-button">
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why Choose Our To-Do App?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Simple & Intuitive</h3>
            <p>Easily add, edit, and manage tasks with a clean interface.</p>
          </div>
          <div className="feature-card">
            <h3>Track Your Progress</h3>
            <p>See your completed tasks and stay motivated every day.</p>
          </div>
          <div className="feature-card">
            <h3>Anytime, Anywhere</h3>
            <p>Access your tasks on any device, from desktop to mobile.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default LandingPage;