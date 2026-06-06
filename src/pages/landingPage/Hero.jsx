import { Button } from "../../components/landing/Button";
import { ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/hero-image.jpg";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-background" />
      <div
        className="hero-image"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Empower Your Student Publication</h1>
          <p className="hero-subtitle">
            Complete platform for managing projects, content, and publishing
            articles. Built for student journalists who want to focus on
            storytelling.
          </p>
          <div className="hero-buttons">
            <div
              onClick={() => {
                navigate("/Readers");
              }}
            >
              <Button className="admin-btn btn-primary">
                Start Reading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div
              onClick={() => {
                navigate("/login");
              }}
            >
              <Button className="admin-btn btn-secondary">
                Continue as Member
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-gradient-overlay" />
    </section>
  );
};

export default Hero;
