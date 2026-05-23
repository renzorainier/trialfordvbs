// AppWrapper.jsx
import React from "react";
import Talk from "./Talk"; // Adjust path as needed
import Main from "./Main"; // Import your main app component

const AppWrapper = () => {
  return (
    <div className="relative min-h-screen w-full">

      {/* 🌌 Aurora background layer */}



      

      {/* 🧠 Main app content */}
      <div className="main-app-content">
        <Main />
      </div>

      {/* 🎤 Floating voice chat */}
      <Talk />
    </div>
  );
};
export default AppWrapper;
