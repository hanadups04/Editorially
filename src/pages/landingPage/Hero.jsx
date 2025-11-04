import { Button } from "../../components/landing/Button";
import { ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/hero-image.jpg";
import "./Hero.css";

const Hero = () => {
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
            <Button size="lg" variant="secondary" className="text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 border-white/30 hover:bg-white/20 text-primary-foreground"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="hero-gradient-overlay" />
    </section>
  );
};

export default Hero;
