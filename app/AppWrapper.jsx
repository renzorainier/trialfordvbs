// AppWrapper.jsx
import React from "react";
import Talk from "./Talk"; // Adjust path as needed
import Main from "./Main"; // Import your main app component
import AuroraBackground from "./AuroraBackground";

const AppWrapper = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* 🌌 Aurora background layer */}
      <AuroraBackground />

      {/* 🧠 Main app content — add relative z-10 so it sits above */}
      <div className="relative z-10 main-app-content">
        <Main />
      </div>

      <Talk />
    </div>
  );
};
export default AppWrapper;
