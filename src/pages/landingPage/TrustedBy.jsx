import { useEffect, useRef } from "react";
import "./TrustedBy.css";

const publications = [
  { name: "The Campus Chronicle", logo: "📰" },
  { name: "University Voice", logo: "📝" },
  { name: "Student Times", logo: "📄" },
  { name: "College Herald", logo: "🗞️" },
  { name: "Academic Press", logo: "📰" },
  { name: "Campus Daily", logo: "📋" },
  { name: "The Scholar Post", logo: "📑" },
  { name: "University Tribune", logo: "🗒️" },
];

const TrustedBy = () => {
  const scrollRef = useRef(null);

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

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={scrollRef} className="trusted-section">
      <div className="trusted-container">
        <h2 className="trusted-heading">
          Trusted by Leading Student Publications
        </h2>

        <div className="trusted-carousel">
          <div className="trusted-scroll">
            {[...publications, ...publications].map((pub, index) => (
              <div key={`${pub.name}-${index}`} className="trusted-item">
                <div className="trusted-card">
                  <span className="trusted-logo">{pub.logo}</span>
                  <span className="trusted-name">{pub.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
