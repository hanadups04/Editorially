import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "./context/Provider.jsx";
import { BranchProvider } from "./context/BranchProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BranchProvider>
      <Provider>
        <App />
      </Provider>
    </BranchProvider>
  </StrictMode>
);
