import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import ModulesPreview from "./ModulesPreview";
import About from "./About";
// import InstallPrompt from "./InstallPrompt";
import PwaInstall from "../../components/readerSide/Pwa";

const LandingPage = () => {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Hero />
      <TrustedBy />
      <ModulesPreview />
      <About />
      {/* <InstallPrompt /> */}
      <PwaInstall />
    </main>
  );
};

export default LandingPage;
