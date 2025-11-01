import { useState, useEffect, useRef } from "react";
import { Layers, FileEdit, Globe } from "lucide-react";
import projectManagementImage from "../../assets/images/module-project-management.jpg";
import contentManagementImage from "../../assets/images/module-content-management.jpg";
import publicationSiteImage from "../../assets/images/module-content-management.jpg";
import "./ModulesPreview.css";

const modules = [
  {
    title: "Project Management",
    description:
      "Organize tasks, deadlines, and team collaboration in one place. Keep your editorial calendar on track.",
    image: projectManagementImage,
    icon: Layers,
  },
  {
    title: "Content Management",
    description:
      "Write, edit, and manage articles with powerful tools. Collaborate with your team seamlessly.",
    image: contentManagementImage,
    icon: FileEdit,
  },
  {
    title: "Publication Site",
    description:
      "Beautiful, responsive site where readers can discover and enjoy your published articles.",
    image: publicationSiteImage,
    icon: Globe,
  },
];

const ModulesPreview = () => {
  const [activeModule, setActiveModule] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % modules.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="modules-section">
      <div className="modules-container">
        <div className="modules-header">
          <h2 className="modules-title">Everything You Need</h2>
          <p className="modules-subtitle">
            Three powerful modules working together to streamline your
            publication workflow
          </p>
        </div>

        <div className="modules-grid">
          <div className="modules-image-container">
            {modules.map((module, index) => (
              <div
                key={module.title}
                className={`module-image ${
                  index === activeModule ? "active" : "inactive"
                }`}
              >
                <img src={module.image} alt={module.title} />
                <div className="module-image-overlay" />
              </div>
            ))}
          </div>

          <div className="modules-content">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  onClick={() => setActiveModule(index)}
                  className={`module-card ${
                    index === activeModule ? "active" : "inactive"
                  }`}
                >
                  <div className="module-card-content">
                    <div
                      className={`module-icon ${
                        index === activeModule ? "active" : "inactive"
                      }`}
                    >
                      <Icon />
                    </div>
                    <div className="module-text">
                      <h3 className="module-title">{module.title}</h3>
                      <p
                        className={`module-description ${
                          index === activeModule ? "active" : "inactive"
                        }`}
                      >
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modules-dots">
          {modules.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveModule(index)}
              className={`dot ${
                index === activeModule ? "active" : "inactive"
              }`}
              aria-label={`Go to module ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesPreview;
