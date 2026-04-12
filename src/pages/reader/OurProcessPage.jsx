/* ===========================
   OurProcessPage JSX + CSS3 Version (Plain JS)
   =========================== */
import { NavbarCSS3 } from "../../components/readerSide/Navbar.css3";
import { FooterCSS3 } from "../../components/readerSide/Footer.css3";
import { useProjectContext } from "../../context/Context";
import {
  Lightbulb,
  CheckCircle,
  ClipboardList,
  PenTool,
  ShieldCheck,
  Sparkles,
  Globe,
} from "lucide-react";
import "./OurProcessPage.css";

const steps = [
  {
    number: "01",
    title: "Propose Idea",
    description:
      "Writers pitch story concepts, research angles, and timely topics during editorial meetings.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Concept Approval",
    description:
      "The editorial board reviews and greenlights proposals based on relevance and newsworthiness.",
    icon: CheckCircle,
  },
  {
    number: "03",
    title: "Task Assignation",
    description:
      "Approved stories are assigned to writers, photographers, and layout artists with clear deadlines.",
    icon: ClipboardList,
  },
  {
    number: "04",
    title: "Content Creation",
    description:
      "Writers research, conduct interviews, and craft their stories. Photographers capture visuals.",
    icon: PenTool,
  },
  {
    number: "05",
    title: "Content Approval",
    description:
      "Editors review all content for accuracy, clarity, grammar, and adherence to journalistic ethics.",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "Finalizing Details",
    description:
      "Layout artists design page spreads. Final proofreading catches any remaining errors.",
    icon: Sparkles,
  },
  {
    number: "07",
    title: "Posting",
    description:
      "The finished article goes live on our platform, reaching the NU Dasmarinas community and beyond.",
    icon: Globe,
  },
];

function StepCardCSS3JSX({ step, index }) {
  const { useScrollAnimation } = useProjectContext();
  const { ref, isVisible } = useScrollAnimation(0.15);
  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className={`process-page__step ${isVisible ? "process-page__step--visible" : ""}`}
    >
      <div className="process-page__step-inner">
        <div className="process-page__step-timeline">
          <div className="process-page__step-icon">
            <Icon size={22} />
          </div>
          {index < steps.length - 1 && (
            <div className="process-page__step-line" />
          )}
        </div>
        <div className="process-page__step-content">
          <span className="process-page__step-number">Step {step.number}</span>
          <h3 className="process-page__step-title">{step.title}</h3>
          <p className="process-page__step-desc">{step.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function OurProcessPageCSS3JSX() {
  return (
    <div className="process-page">
      <NavbarCSS3 />
      <div style={{ height: "104px" }} />

      <section className="process-page__hero">
        <div className="process-page__hero-bg" />
        <div className="process-page__hero-content">
          <span className="process-page__hero-label">Our Process</span>
          <h1 className="process-page__hero-title">
            How We Deliver Our Stories
          </h1>
          <p className="process-page__hero-subtitle">
            Transparency is at the heart of what we do. Here's a look at the
            journey every article takes — from idea to publication.
          </p>
        </div>
      </section>

      <section className="process-page__steps">
        {steps.map((step, i) => (
          <StepCardCSS3JSX key={step.number} step={step} index={i} />
        ))}
      </section>

      <section className="process-page__closing">
        <div className="process-page__closing-card">
          <h2 className="process-page__closing-title">Quality You Can Trust</h2>
          <p className="process-page__closing-text">
            Every article published by The Nuntium passes through multiple
            layers of review. Our commitment to accuracy, fairness, and
            excellence ensures that you receive stories worth reading.
          </p>
        </div>
      </section>

      <FooterCSS3 />
    </div>
  );
}
