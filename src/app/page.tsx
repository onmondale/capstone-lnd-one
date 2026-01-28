"use client";
import React, { useState, useEffect } from "react";
import "./styles/homepage-styles.css";
import { TimeProvider, useTimeContext } from "../hooks/useTimeContext";
import { formatTime } from "../utils/timeUtils";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import { usePopups } from "../hooks/usePopups";

// Dynamic imports for components that may access window/document
const FishNavigation = dynamicImport(
  () => import("../components/FishNavigation"),
  {
    ssr: false,
  },
);

const ThemeToggle = dynamicImport(
  () => import("../components/ThemeToggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
  },
);

const TimeIcon = dynamicImport(
  () => import("../components/TimeIcon").then((mod) => mod.TimeIcon),
  {
    ssr: false,
  },
);

const Popup = dynamicImport(() => import("../components/Popup"), {
  ssr: false,
});

const MobileOverlay = dynamicImport(
  () => import("../components/MobileOverlay"),
  {
    ssr: false,
  },
);

// Force dynamic rendering to prevent SSR issues with window/document access
export const dynamic = "force-dynamic";

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeContext = useTimeContext();
  const {
    popupData,
    popupPositions,
    dismissedPopups,
    hasSeenPopups,
    dismissPopup,
  } = usePopups();

  useEffect(() => {
    setIsClient(true);
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isClient || !timeContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main text-alt">
        <p>Loading...</p>
      </div>
    );
  }

  const { currentTime, timeOfDay } = timeContext;
  const clientTime = formatTime(currentTime);

  return (
    <div className="viewport-container min-h-screen p-0 m-0 bg-alt text-alt">
      {/* Mobile Overlay */}
      {isClient && <MobileOverlay />}

      {/* Only show overlay and popups if user hasn't seen them before and not on mobile */}
      {!hasSeenPopups && !isMobile && (
        <>
          <div
            className={`fixed inset-0 bg-main transition-opacity duration-300 ease-in-out pointer-events-auto
                     ${
                       dismissedPopups.size < popupData.length
                         ? "opacity-70"
                         : "opacity-0 pointer-events-none"
                     }`}
            style={{ zIndex: 40 }}
          />

          {popupData.map((popup, index) => {
            if (dismissedPopups.has(index)) return null;
            return (
              <Popup
                key={index}
                title={popup.title}
                description={popup.description}
                position={popupPositions[index]}
                onDismiss={() => dismissPopup(index)}
              />
            );
          })}
        </>
      )}
      <div className={!hasSeenPopups ? "pointer-events-none" : ""}>
        <div className="flex flex-col h-screen">
          <div className="flex flex-row h-[35%]">
            <div className="w-[42%] container-box flex flex-col">
              <div className="flex justify-between items-center px-10 pt-6">
                <h1 className="text-sm">
                  Seeing Yourself <br /> in Your Structure:{" "}
                  <p className="font-bold">Lock and Dam One/Ford Dam</p>
                </h1>
                <h2 className="text-sm text-right">
                  Nelson Mondale <br /> MCST Macaleseter <br /> Fall 2024
                </h2>
              </div>
              <div>
                <p className="text-4xl text-center font-bold my-[-1.5rem]">
                  {clientTime}
                </p>
              </div>
              <div className="flex justify-between items-center px-10">
                <h1 className="text-sm">it's currently</h1>
                <h2 className="text-sm text-right">
                  {timeOfDay} at lock and dam 1
                </h2>
              </div>
            </div>
            <div className="w-[38%] container-box">
              <p className="text-sm p-8 text-justify">
                <i> Seeing Yourself in Your Structure </i> uses Lock and Dam 1
                (LD1) as a lens to examine how built infrastructure shapes
                social, cultural, and ideological understandings of river space.
                Drawing parallels between physical spaces like LD1 and digital
                platforms, the project leverages speculative design to challenge
                traditional planning practices, fostering critical reflection
                and imagining more inclusive, equitable urban river spaces. It
                aims to provide the tools and perspectives needed to rethink how
                both water and knowledge flow in a post-digital world.
              </p>
            </div>
            <div className="w-[20%] container-box flex items-center justify-center">
              <div className="w-[75%]">
                <TimeIcon />
              </div>
            </div>
          </div>
          <div className="flex flex-row  h-[65%]">
            <div className="w-[4%] container-box flex flex-col justify-end pb-4">
              <ThemeToggle />
            </div>
            <div className="w-[20%] container-box flex flex-col">
              <h1 className="text-sm p-8">
                look into the river, and click on a fish to reimagine the lock
                and dam.
              </h1>
              <Link
                href="/about"
                className="w-[100%] h-[10%] flex items-center justify-between navigation-box"
              >
                <p className="text-sm pl-8">About Project</p>
                <p className="text-sm pr-8 text-right">→</p>
              </Link>
              <Link
                href="/litreview"
                className="w-[100%] h-[10%] flex items-center justify-between navigation-box"
              >
                <p className="text-sm pl-8">Literature Review</p>
                <p className="text-sm pr-8 text-right">→</p>
              </Link>
            </div>
            <div className="w-[76%] container-box overflow-hidden">
              <div className="w-full h-full">
                <FishNavigation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
