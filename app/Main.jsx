"use client";

import React, { useState, useEffect } from "react";
// Components
import Tab from "./Tab";
import StudentOutTime from "./StudentOutTime";
import PointingSystemGraph from "./PointingSystemGraph";
import AttendanceChart from "./AttendanceChart";
import Schedule from "./Schedule";
import DailyRewards from "./DailyRewards";
import SalvationDecision from "./SalvationDecision";
import StudentPointsRanking from "./StudentPointsRanking";
import Store from "./Store";
import DisplayControl from "./DisplayControl";
import RecitationPoints from "./RecitationPoints";
import Password from "./Password.jsx";
import Weather from "./Weather";

// Uniform Outlined Icons
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { FiClock, FiMonitor, FiAward } from "react-icons/fi";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { TbDoorExit, TbCross } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

function Main() {
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isVisitorView, setIsVisitorView] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(false);

  const toggleCard = () => setCardExpanded(!cardExpanded);

  const handleButtonClick = (componentName) => {
    setCurrentComponent(componentName);
  };

  const handleBackButtonClick = () => {
    setCurrentComponent(null);
    setIsVisitorView(false);
  };

  const renderCurrentComponent = () => {
    switch (currentComponent) {
      case "Tab":
        return <Tab />;
      case "Out":
        return (
          <Password
            isVisitorView={isVisitorView}
            setIsVisitorView={setIsVisitorView}
            correctPassword="1111">
            <StudentOutTime isVisitorView={isVisitorView} />
          </Password>
        );
      case "Point":
        return (
          <Password
            isVisitorView={isVisitorView}
            setIsVisitorView={setIsVisitorView}
            correctPassword="9999">
            <PointingSystemGraph isVisitorView={isVisitorView} />
          </Password>
        );
      case "Attendance":
        return <AttendanceChart />;
      case "Schedule":
        return <Schedule />;
      case "Rewards":
        return <DailyRewards />;
      case "SalvationDecision":
        return <SalvationDecision />;
      case "Rank":
        return <StudentPointsRanking />;
      case "Store":
        return (
          <Password
            isVisitorView={isVisitorView}
            setIsVisitorView={setIsVisitorView}
            correctPassword="2025">
            <Store isVisitorView={isVisitorView} />
          </Password>
        );
      case "DisplayControl":
        return (
          <Password
            isVisitorView={isVisitorView}
            setIsVisitorView={setIsVisitorView}
            correctPassword="0000">
            <DisplayControl isVisitorView={isVisitorView} />
          </Password>
        );
      case "RecitationPoints":
        return (
          <Password
            isVisitorView={isVisitorView}
            setIsVisitorView={setIsVisitorView}
            correctPassword="4444">
            <RecitationPoints isVisitorView={isVisitorView} />
          </Password>
        );
      default:
        return (
          // Changed to min-h-[100dvh] and added py-8 so it never hits the absolute edges on small screens
          <div
            className="flex flex-col justify-center items-center min-h-[100dvh] relative overflow-y-auto overflow-x-hidden py-8"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.05))",
            }}>
            {/* Header Area */}
            <div className="flex-shrink-0 w-full flex flex-col items-center z-10 mb-2">
              <div className="text-white text-center relative z-10">
                <h1 className="font-bold text-7xl sm:text-8xl md:text-9xl lg:text-9xl">
                  {/* Note: changed text-white-400 to text-white as 400 is not a valid tailwind white shade */}
                  <span className="text-white font-bold">POLAR EXTREMES</span>
                </h1>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  D V B S &nbsp;2 0 2 6
                </h3>
              </div>
            </div>

            {/* <div className="flex-shrink-0 container mx-auto mb-4 z-10 scale-90 origin-top border border-white/10 rounded-xl overflow-hidden">
              <Weather />
            </div> */}
            {/* Grid Area - REMOVED flex-1 so it stops pushing the header to the top */}
            <div className="w-full px-16 max-w-[360px] mx-auto z-10 flex flex-col justify-center min-h-0">
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Tab")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <HiOutlineClipboardList
                    style={{ fontSize: "3.5em" }}
                    className="mb-2"
                  />
                  <span className="text-base">Attendance</span>
                </button>

                <button
                  className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Attendance")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <HiOutlineTrendingUp
                    style={{ fontSize: "3.5em" }}
                    className="mb-2"
                  />
                  <span className="text-base">List</span>
                </button>

                <button
                  className="focus:outline-none bg-yellow-400/10 backdrop-blur-lg border border-yellow-400/50 shadow-[0_4px_15px_rgba(250,204,21,0.15)] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-yellow-400/20 hover:border-yellow-400 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Schedule")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <FiClock
                    style={{ fontSize: "3.5em" }}
                    className="mb-2 text-yellow-300"
                  />
                  <span className="text-base">Schedule</span>
                </button>

                <button
                  className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Point")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <HiOutlineUserGroup
                    style={{ fontSize: "3.5em" }}
                    className="mb-2"
                  />
                  <span className="text-base">Group Points</span>
                </button>

                <button
                  className="focus:outline-none bg-yellow-400/10 backdrop-blur-lg border border-yellow-400/50 shadow-[0_4px_15px_rgba(250,204,21,0.15)] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-yellow-400/20 hover:border-yellow-400 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Rewards")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <FiAward
                    style={{ fontSize: "3.5em" }}
                    className="mb-2 text-yellow-300"
                  />
                  <span className="text-base">Rewards</span>
                </button>

                <button
                  className="focus:outline-none bg-yellow-400/10 backdrop-blur-lg border border-yellow-400/50 shadow-[0_4px_15px_rgba(250,204,21,0.15)] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-yellow-400/20 hover:border-yellow-400 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("SalvationDecision")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <TbCross
                    style={{ fontSize: "3.5em" }}
                    className="mb-2 text-yellow-300"
                  />
                  <span className="text-base">Salvation</span>
                </button>

                <button
                  className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Store")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <MdOutlineLocalGroceryStore
                    style={{ fontSize: "3.5em" }}
                    className="mb-2"
                  />
                  <span className="text-base">Store</span>
                </button>

                <button
                  className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                  onClick={() => handleButtonClick("Out")}
                  style={{ animation: "slide-from-left 1s ease forwards" }}>
                  <TbDoorExit style={{ fontSize: "3.5em" }} className="mb-2" />
                  <span className="text-base">Out</span>
                </button>
              </div>

              {/* Dropdown Toggle */}
              <div className="flex justify-center items-center mt-3">
                <div className="px-4 py-1 cursor-pointer" onClick={toggleCard}>
                  <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-300 ${
                      cardExpanded ? "rotate-180 mb-1" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Menu Items */}
              {cardExpanded && (
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                    onClick={() => handleButtonClick("DisplayControl")}
                    style={{ animation: "slide-from-left 1s ease forwards" }}>
                    <FiMonitor style={{ fontSize: "3.5em" }} className="mb-2" />
                    <span className="text-base">Monitor</span>
                  </button>
                  <button
                    className="focus:outline-none bg-white/5 backdrop-blur-lg border border-white/10 opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:opacity-100 flex flex-col items-center justify-center w-full aspect-square p-2"
                    onClick={() => handleButtonClick("RecitationPoints")}
                    style={{ animation: "slide-from-left 1s ease forwards" }}>
                    <IoAddCircleOutline
                      style={{ fontSize: "3.5em" }}
                      className="mb-2"
                    />
                    <span className="text-base">Recitation</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const backButton = currentComponent ? (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        className="bg-gray-700/80 backdrop-blur-md border border-white/20 text-white font-bold p-3 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
        onClick={handleBackButtonClick}>
        <IoMdArrowRoundBack className="text-2xl" />
      </button>
    </div>
  ) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentComponent]);

  return (
    <div className="fade-in min-h-[100dvh]">
      {backButton}
      {renderCurrentComponent()}
    </div>
  );
}

export default Main;
