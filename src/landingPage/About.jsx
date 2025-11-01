import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import "./About.css";

const features = [
  "Intuitive project management tools designed for editorial teams",
  "Powerful content editor with real-time collaboration",
  "Beautiful, customizable publication website",
  "Mobile-ready and installable as a progressive web app",
  "Built by students, for students",
];

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className="about-content-wrapper">
          <div className="about-header">
            <h2 className="about-title">About Our Platform</h2>
            <p className="about-subtitle">
              Empowering student journalists with professional-grade tools
            </p>
          </div>

          <div className="about-card">
            <p className="about-paragraph">
              Our Student Publication Platform was created to address the unique
              challenges faced by student journalists. We understand that
              managing a publication requires more than just writing skills—it
              demands coordination, organization, and the right tools to bring
              stories to life.
            </p>

            <p className="about-paragraph">
              Whether you're managing a campus newspaper, online magazine, or
              digital publication, our system provides everything you need in
              one integrated platform. From planning your editorial calendar to
              publishing your final articles, we've streamlined every step of
              the process.
            </p>

            <div className="features-section">
              <h3 className="features-title">Key Features</h3>
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cta-box">
              <p className="cta-title">Join the Community</p>
              <p className="cta-text">
                Join dozens of student publications already using our platform
                to manage their content and reach thousands of readers. Start
                your journey with us today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
