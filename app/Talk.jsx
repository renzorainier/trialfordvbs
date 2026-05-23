"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaUsers,
  FaSpinner,
  FaXmark,
  FaPhone,
} from "react-icons/fa6";

const RTC_APP_ID = "1ecdb7f86fd545f8b0b106693dee8d4a"; // Replace with your actual Agora RTC App ID
const DEFAULT_CHANNEL_NAME = "my-simple-voice-channel";

const VoiceChatComponent = () => {
  const [micMuted, setMicMuted] = useState(true);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRemoteUids, setActiveRemoteUids] = useState(new Set());
  const [isRemoteUserSpeaking, setIsRemoteUserSpeaking] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startAnimation, setStartAnimation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEndCallUI, setShowEndCallUI] = useState(false);
  const [isOverEndCallArea, setIsOverEndCallArea] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [rippleCount, setRippleCount] = useState(3);

  const offset = useRef({ x: 0, y: 0 });
  const componentRef = useRef(null);
  const dragStartTime = useRef(0);
  const initialClientPos = useRef({ x: 0, y: 0 });

  const AgoraRTC = useRef(null);
  const rtcClient = useRef(null);
  const localAudioTrack = useRef(null);
  const rtcUid = useRef(Math.floor(Math.random() * 1000000));

  const pressSoundRef = useRef(null);

  const playPressSound = useCallback(() => {
    if (pressSoundRef.current) {
      pressSoundRef.current.currentTime = 0;
      pressSoundRef.current
        .play()
        .catch((e) => console.error("Error playing press sound:", e));
    }
  }, []);

  useEffect(() => {
    const setComponentPosition = () => {
      if (componentRef.current) {
        componentRef.current.offsetWidth; // Force a reflow

        const componentWidth = componentRef.current.offsetWidth;
        const componentHeight = componentRef.current.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const targetX = screenWidth - componentWidth - 20; // 20px padding from right
        const targetY = screenHeight - componentHeight - 20; // 20px padding from bottom

        if (!startAnimation) {
          // Initial slide-in animation from off-screen right
          setPosition({ x: screenWidth, y: targetY });
          setTimeout(() => {
            setPosition({ x: targetX, y: targetY });
            setStartAnimation(true);
          }, 100);
        } else {
          // If already animated, just adjust to new target position
          setPosition((prev) => ({ x: targetX, y: targetY }));
        }
      }
    };

    setComponentPosition();
    window.addEventListener("resize", setComponentPosition);

    if (callEnded) {
      setComponentPosition();
    }

    return () => {
      window.removeEventListener("resize", setComponentPosition);
    };
  }, [componentRef.current, joined, startAnimation, callEnded]);

  useEffect(() => {
    const loadAgoraRTC = async () => {
      if (typeof window !== "undefined") {
        try {
          const rtcMod = await import("agora-rtc-sdk-ng");
          AgoraRTC.current = rtcMod.default;
          console.log("Agora RTC SDK loaded dynamically.");
          setLoading(false);
        } catch (error) {
          console.error("Failed to load Agora RTC SDK:", error);
          setLoading(false);
        }
      }
    };
    loadAgoraRTC();

    return () => {
      if (joined) {
        leaveChannel();
      }
    };
  }, [joined]);

  const joinChannel = useCallback(async () => {
    if (!AgoraRTC.current || loading) {
      console.warn("Agora RTC SDK not loaded yet or still loading.");
      return;
    }

    try {
      console.log("Initializing RTC client...");
      rtcClient.current = AgoraRTC.current.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      rtcClient.current.enableAudioVolumeIndicator(250);

      rtcClient.current.on("user-joined", (user) => {
        console.log(`Remote user joined RTC: UID ${user.uid}`);
        setActiveRemoteUids((prevUids) => new Set(prevUids).add(user.uid));
      });

      rtcClient.current.on("user-published", async (user, mediaType) => {
        console.log(
          `Remote user published: UID ${user.uid}, Media Type: ${mediaType}`
        );
        await rtcClient.current.subscribe(user, mediaType);

        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
          console.log(`Subscribed and playing audio for RTC UID: ${user.uid}`);
        } else if (mediaType === "video" && user.videoTrack) {
          console.log(`Subscribed to video for RTC UID: ${user.uid}`);
        }
      });
      rtcClient.current.on("user-left", (user) => {
        console.log(`Remote user left RTC: UID ${user.uid}`);
        setActiveRemoteUids((prevUids) => {
          const newUids = new Set(prevUids);
          newUids.delete(user.uid);
          return newUids;
        });
      });

      rtcClient.current.on("user-unpublished", (user) => {
        console.log(`Remote user unpublished: UID ${user.uid}`);
      });

      rtcClient.current.on("volume-indicator", (volumes) => {
        const isAnyRemoteSpeaking = volumes.some(
          (volume) => volume.uid !== rtcUid.current && volume.level > 5
        );
        setIsRemoteUserSpeaking(isAnyRemoteSpeaking);
      });

      console.log(
        `Joining RTC channel '${DEFAULT_CHANNEL_NAME}' with UID ${rtcUid.current}...`
      );
      await rtcClient.current.join(
        RTC_APP_ID,
        DEFAULT_CHANNEL_NAME,
        null,
        rtcUid.current
      );
      console.log("RTC channel joined successfully.");

      localAudioTrack.current =
        await AgoraRTC.current.createMicrophoneAudioTrack();
      await localAudioTrack.current.setMuted(true);
      await localAudioTrack.current.setVolume(100);
      await rtcClient.current.publish(localAudioTrack.current);
      console.log("Local audio track created and published (muted initially).");

      setJoined(true);
      setMicMuted(true);
      setIsRemoteUserSpeaking(false);
      setCallEnded(false);

      const initialRemoteUids = rtcClient.current.remoteUsers.map(
        (user) => user.uid
      );
      setActiveRemoteUids(new Set(initialRemoteUids));
    } catch (error) {
      console.error("Failed to join RTC channel:", error);
      alert(`Failed to join voice chat: ${error.message}`);
      setJoined(false);
      setActiveRemoteUids(new Set());
      setIsRemoteUserSpeaking(false);
      setCallEnded(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !joined && AgoraRTC.current && !callEnded) {
      joinChannel();
    }
  }, [loading, joined, joinChannel, callEnded]);

  const leaveChannel = useCallback(async () => {
    console.log("Leaving channel...");
    try {
      localAudioTrack.current?.stop();
      localAudioTrack.current?.close();
      await rtcClient.current?.unpublish();
      await rtcClient.current?.leave();
      console.log("Left channel successfully.");
    } catch (error) {
      console.error("Error leaving channel:", error);
    } finally {
      setJoined(false);
      setMicMuted(true);
      setActiveRemoteUids(new Set());
      setIsRemoteUserSpeaking(false);
      rtcClient.current = null;
      localAudioTrack.current = null;
      setCallEnded(true);
    }
  }, []);

  const startTalking = useCallback(async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setMuted(false);
      setMicMuted(false);
      console.log("Microphone unmuted (talking).");
      playPressSound();
      setIsRemoteUserSpeaking(false);
    }
  }, [playPressSound]);

  const stopTalking = useCallback(async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setMuted(true);
      setMicMuted(true);
      console.log("Microphone muted (stopped talking).");
    }
  }, []);

  const handleStart = useCallback((e) => {
    if (e.target.closest("button")) {
      return;
    }

    setIsDragging(true);
    setShowEndCallUI(true);
    dragStartTime.current = Date.now();

    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const clientY = e.type.startsWith("touch")
      ? e.touches[0].clientY
      : e.touches[0].clientY;

    initialClientPos.current = { x: clientX, y: clientY };

    if (componentRef.current) {
      offset.current = {
        x: clientX - componentRef.current.getBoundingClientRect().left,
        y: clientY - componentRef.current.getBoundingClientRect().top,
      };
    }
  }, []);

  const handleMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const clientX = e.type.startsWith("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const clientY = e.type.startsWith("touch")
        ? e.touches[0].clientY
        : e.clientY;

      const newPosition = {
        x: clientX - offset.current.x,
        y: clientY - offset.current.y,
      };
      setPosition(newPosition);

      const endCallAreaCenterX = window.innerWidth / 2;
      const endCallAreaCenterY = 60;
      const endCallAreaRadius = 40;

      const draggableCenterX =
        newPosition.x + (componentRef.current?.offsetWidth || 0) / 2;
      const draggableCenterY =
        newPosition.y + (componentRef.current?.offsetHeight || 0) / 2;

      const distance = Math.sqrt(
        Math.pow(draggableCenterX - endCallAreaCenterX, 2) +
          Math.pow(draggableCenterY - endCallAreaCenterY, 2)
      );

      const collisionThreshold =
        endCallAreaRadius +
        Math.min(
          componentRef.current?.offsetWidth || 0,
          componentRef.current?.offsetHeight || 0
        ) /
          3;
      setIsOverEndCallArea(distance < collisionThreshold);

      if (e.cancelable) {
        e.preventDefault();
      }
    },
    [isDragging]
  );

  const handleEnd = useCallback(
    (e) => {
      setIsDragging(false);
      setShowEndCallUI(false);

      if (componentRef.current) {
        const componentRect = componentRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const componentWidth = componentRect.width;

        const currentX = position.x;
        const currentY = position.y;

        if (isOverEndCallArea) {
          console.log("Dropped in end call area. Ending call.");
          leaveChannel();
          const targetX = screenWidth - componentWidth - 20;
          const targetY = window.innerHeight - componentRect.height - 20;
          setPosition({ x: targetX, y: targetY });
          return;
        }

        let newX;
        if (currentX + componentWidth / 2 < screenWidth / 2) {
          newX = 20;
        } else {
          newX = screenWidth - componentWidth - 20;
        }

        let newY = Math.max(
          20,
          Math.min(currentY, window.innerHeight - componentRect.height - 20)
        );

        setPosition({ x: newX, y: newY });
      }
    },
    [position, isOverEndCallArea, leaveChannel]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    } else {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const totalActiveUsers = activeRemoteUids.size + (joined ? 1 : 0);

  // Aurora color layers for animated effects
  const AURORA_MAGENTA = "#CC00FF";
  const AURORA_PINK = "#FF55FF";
  const AURORA_CYAN = "#00FFFF";
  const AURORA_MINT = "#00FA9A";

  // Primary accent uses magenta as base
  const ACCENT_COLOR_HEX = AURORA_MAGENTA;
  const ACCENT_COLOR_RGB = "204, 0, 255";
  const ACCENT_COLOR_HOVER_LIGHT = "#E600FF";

  return (
    <>
      {/* Dark Overlay - Now uses a subtle backdrop blur to keep the theme visible */}
      {!micMuted && joined && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
          style={{ zIndex: 45 }}
        ></div>
      )}

      {/* End Call UI (the circular 'X' at the top) */}
      {showEndCallUI && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 z-40 backdrop-blur-md border shadow-2xl`}
          style={{
            backgroundColor: isOverEndCallArea ? "rgba(255, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.1)",
            color: "#FFFFFF",
            borderColor: isOverEndCallArea ? "rgba(255, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.2)",
            boxShadow: isOverEndCallArea
              ? "0 0 30px rgba(255, 0, 0, 0.6)"
              : "0 8px 32px rgba(0,0,0,0.3)",
            zIndex: 51,
          }}
        >
          <FaXmark
            className={`w-12 h-12 transition-transform duration-200 ${
              isOverEndCallArea ? "scale-125 text-red-100" : "text-white"
            }`}
          />
        </div>
      )}

      {/* Main Voice Chat Component (draggable) */}
      <div
        ref={componentRef}
        className={`fixed z-50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/10 bg-white/5 transition-all duration-500 ease-out
                        w-auto h-auto min-w-[120px] cursor-grab active:cursor-grabbing
                        ${isRemoteUserSpeaking && micMuted ? "animate-pulse-remote-speaking" : ""} `}
        style={{
          left: position.x,
          top: position.y,
          transition: startAnimation ? "left 0.7s ease-out, top 0.3s ease-out" : "none",
          userSelect: "none",
          MozUserSelect: "none",
          WebkitUserSelect: "none",
          msUserSelect: "none",
          display: callEnded && !isDragging ? "none" : "block",
          zIndex: 50,
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="absolute inset-0 z-0"></div>

        {/* Ripple elements */}
        {!micMuted &&
          joined &&
          [...Array(rippleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full animate-full-screen-pulse"
              style={{
                backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.5)`,
                zIndex: -1,
                animationDelay: `${i * 0.4}s`,
                transform: `scale(0)`,
              }}
            ></div>
          ))}

        <div className="relative flex flex-col p-4 z-10 text-white">
          <div className="flex flex-col items-center justify-center space-y-2">
            {loading ? (
              <>
                <FaSpinner
                  className="w-12 h-12 mb-2 animate-spin-slow text-purple-400"
                />
                <p className="text-sm font-medium text-white">
                  Connecting...
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center text-base font-semibold space-x-1 text-white">
                  <FaUsers className="w-4 h-4 text-purple-400" />
                  <span>Users: {totalActiveUsers}</span>
                </div>

                <p className="text-sm text-center font-medium transition-all duration-200">
                  {micMuted ? (
                    <span className="text-white/70">Hold to talk</span>
                  ) : (
                    <span className="text-green-300 font-semibold animate-pulse">
                      Talking...
                    </span>
                  )}
                </p>

                {/* Mic Button updated for Glassmorphism & Purple accent */}
                <button
                  onMouseDown={startTalking}
                  onMouseUp={stopTalking}
                  onTouchStart={startTalking}
                  onTouchEnd={stopTalking}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-base select-none transition-all duration-300 ease-in-out transform border
                    ${micMuted
                      ? "bg-white/10 border-white/10 hover:bg-white/20 shadow-lg"
                      : "bg-purple-500/20 border-purple-400 text-purple-100 shadow-[0_0_25px_rgba(204,0,255,0.4)] animate-pulse-mic"}
                  `}
                  aria-pressed={!micMuted}
                  aria-label={micMuted ? "Hold to talk" : "Release to Stop Talking"}
                  title={micMuted ? "Hold to Talk" : "Release to Stop Talking"}
                >
                  {micMuted ? (
                    <FaMicrophoneSlash className="w-10 h-10 pointer-events-none select-none text-white/80" />
                  ) : (
                    <FaMicrophone className="w-10 h-10 pointer-events-none select-none text-purple-300" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <audio ref={pressSoundRef} src="/press.wav" preload="auto" />
      </div>

      {/* Join Call Button - visible only when callEnded is true and not currently joined - uses purple accent */}
      {callEnded && !joined && (
        <button
          onClick={joinChannel}
          className="fixed bottom-5 right-5 z-50 w-20 h-20 rounded-full flex items-center justify-center text-purple-300 text-lg font-bold bg-purple-500/10 backdrop-blur-lg border border-purple-500/50 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-purple-500/20"
          style={{ boxShadow: "0 0 20px rgba(204, 0, 255, 0.3)" }}
        >
          <FaPhone className="w-8 h-8" />
        </button>
      )}

      <style jsx>{`
        @keyframes pulse-mic {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(${ACCENT_COLOR_RGB}, 0.5);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(${ACCENT_COLOR_RGB}, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(${ACCENT_COLOR_RGB}, 0);
          }
        }

        @keyframes pulse-remote-speaking {
          0% {
            border-color: rgba(${ACCENT_COLOR_RGB}, 0.3);
            box-shadow: 0 0 0 0 rgba(${ACCENT_COLOR_RGB}, 0.3);
          }
          50% {
            border-color: rgba(${ACCENT_COLOR_RGB}, 0.8);
            box-shadow: 0 0 0 25px rgba(${ACCENT_COLOR_RGB}, 0);
          }
          100% {
            border-color: rgba(${ACCENT_COLOR_RGB}, 0.3);
            box-shadow: 0 0 0 0 rgba(${ACCENT_COLOR_RGB}, 0);
          }
        }
        .animate-pulse-remote-speaking {
          animation: pulse-remote-speaking 2s infinite ease-out;
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        @keyframes full-screen-pulse {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(9);
            opacity: 0;
          }
        }

        .animate-full-screen-pulse {
          animation: full-screen-pulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
      `}</style>
    </>
  );
};

export default VoiceChatComponent;
