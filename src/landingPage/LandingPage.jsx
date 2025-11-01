import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import ModulesPreview from "./ModulesPreview";
import About from "./About";
import InstallPrompt from "./InstallPrompt";

const LandingPage = () => {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Hero />
      <TrustedBy />
      <ModulesPreview />
      <About />
      <InstallPrompt />
    </main>
  );
};

export default LandingPage;
