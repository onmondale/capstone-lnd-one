"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTimeContext } from "../hooks/useTimeContext";
import "../app/styles/homepage-styles.css";
import { ThemeToggle } from "./ThemeToggle";
import Popup from "./Popup";

interface ArtifactLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  parentPage: string;
  artifacts: string[];
  currentArtifact: string;
}

const ArtifactLayout: React.FC<ArtifactLayoutProps> = ({
  children,
  title,
  description,
  parentPage,
  artifacts,
  currentArtifact,
}) => {
  const { currentTheme } = useTimeContext();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition] = useState(() => ({
    top: Math.random() * 60 + 20,
    left: Math.random() * 60 + 20,
  }));

  return (
    <div
      className={`min-h-screen bg-alt text-alt ${
        currentTheme === "dark" ? "text-white" : "text-black"
      }`}
    >
      {showPopup && (
        <>
          <div
            className="fixed inset-0 bg-main transition-opacity duration-300 ease-in-out pointer-events-auto opacity-70"
            style={{ zIndex: 40 }}
            onClick={() => setShowPopup(false)}
          />
          <Popup
            title={title}
            description={description}
            position={popupPosition}
            onDismiss={() => setShowPopup(false)}
          />
        </>
      )}
      <div className="flex flex-row h-screen">
        <div className="w-[20%] container-box">
          <Link
            href={"/"}
            className="text-nav font-bold flex items-center justify-center p-4 border-b border-alt"
          >
            ← Return Home
          </Link>
          <h2 className="text-2xl italic pt-6 px-6">Artifact Collection:</h2>
          <h1 className="text-3xl font-bold pb-3 pt-1 px-6">{title}</h1>
          <button
            onClick={() => setShowPopup(true)}
            className="mx-6 mb-4 px-4 py-2 bg-main border border-alt text-alt rounded-full hover:bg-alt hover:text-main transition-all flex items-center justify-between w-[80%]"
          >
            <span className="text-2xl font-black">𓁺</span>
            <span className="text-sm">Look a Little Closer</span>
          </button>
          {artifacts.map((artifact, index) => (
            <Link
              key={index}
              href={`/${parentPage}/${artifact
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className={`w-[100%] h-[7%] flex items-center pl-8 justify-between artifact-navigation-box ${
                currentArtifact.toLowerCase() === artifact.toLowerCase()
                  ? "bg-alt text-main"
                  : "bg-main text-alt"
              }`}
            >
              {artifact}
              <p className="text-sm pr-8 text-right">→</p>
            </Link>
          ))}
          <div className="w-1/2 flex flex-col items-start ml-4 pt-8">
            <p className="mb-2">Theme Select:</p>
            <div className="flex">
              <ThemeToggle />
              <div className="flex flex-col justify-between h-[110px] ml-2">
                <span className="text-sm italic">Dark</span>
                <span className="text-sm italic">Time</span>
                <span className="text-sm italic">Light</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[80%] container-box overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ArtifactLayout;
