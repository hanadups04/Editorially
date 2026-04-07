/* ===========================
   SectionDivider JSX + CSS3 Version (Plain JS)
   =========================== */
import "./SectionDivider.css";

export function SectionDividerCSS3JSX() {
  return (
    <div className="section-divider">
      <div className="section-divider__inner">
        <div className="section-divider__line" />
        <div className="section-divider__dots">
          <div className="section-divider__dot" />
          <div className="section-divider__dot" />
          <div className="section-divider__dot" />
        </div>
        <div className="section-divider__line" />
      </div>
    </div>
  );
}
