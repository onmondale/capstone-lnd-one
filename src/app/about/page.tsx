"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTimeContext } from "../../hooks/useTimeContext";
import Link from "next/link";
import "../styles/homepage-styles.css";
import { ThemeToggle } from "../../components/ThemeToggle";
import { debounce } from "lodash";
import { aboutSections } from "./sections";

const AboutPage: React.FC = () => {
  const { currentTheme } = useTimeContext();
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const updateActiveSection = useCallback(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const container = containerRef.current;
    const { scrollTop, clientHeight } = container;
    const middleOfScreen = scrollTop + clientHeight / 2;

    for (let i = 0; i < aboutSections.length; i++) {
      const element = container.querySelector(`#section-${i}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + container.scrollTop;
        if (
          elementTop <= middleOfScreen &&
          elementTop + rect.height > middleOfScreen
        ) {
          setActiveSection(i);
          break;
        }
      }
    }
  }, []);

  const debouncedUpdateActiveSection = useMemo(
    () => debounce(updateActiveSection, 50),
    [updateActiveSection],
  );

  const scrollToSection = useCallback((sectionNumber: number) => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const element = containerRef.current.querySelector(
      `#section-${sectionNumber}`,
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = containerRef.current.scrollTop;
      const elementTop = rect.top + scrollTop;
      containerRef.current.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
      setActiveSection(sectionNumber);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedUpdateActiveSection);
      return () =>
        container.removeEventListener("scroll", debouncedUpdateActiveSection);
    }
  }, [debouncedUpdateActiveSection, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-alt text-alt font-cardo ${
        currentTheme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div className="grid grid-cols-[27%_73%] h-screen">
        <div className="container-box flex flex-col">
          <Link
            href="/"
            className="text-nav font-bold flex items-center justify-center p-4 border-b border-alt"
          >
            ← Return Home
          </Link>
          <div className="flex flex-col p-6 pl-8 pt-4 h-full">
            <div className="grid grid-rows-2 gap-4 w-full  bg-main border border-alt rounded-xl p-6">
              <div className="flex gap-4 justify-between w-full">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 max-w-[60px] aspect-square rounded-full flex items-center justify-center border border-alt cursor-pointer text-xl font-bold ${
                      activeSection === i
                        ? "bg-alt text-main"
                        : "bg-main text-alt"
                    }`}
                    onClick={() => scrollToSection(i)}
                  >
                    <div className="text-center">{i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-between w-full">
                {[3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 max-w-[60px] aspect-square rounded-full flex items-center justify-center border border-alt cursor-pointer text-xl font-bold ${
                      activeSection === i
                        ? "bg-alt text-main"
                        : "bg-main text-alt"
                    }`}
                    onClick={() => scrollToSection(i)}
                  >
                    <div className="text-center">{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="py-6">
                {aboutSections.map((section, index) => (
                  <p
                    key={index}
                    className={`mb-2 cursor-pointer text-lg ${
                      activeSection === index ? "underline" : ""
                    }`}
                    onClick={() => scrollToSection(index)}
                  >
                    <strong>{`${index + 1}.`}</strong> &nbsp;
                    {section.title}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-auto pt-6">
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
        </div>
        <div className="container-box overflow-y-auto" ref={containerRef}>
          {aboutSections.map((section, index) => (
            <div key={index} id={`section-${index}`}>
              <div className="border-t border-b p-8 w-full">
                <div className=" border rounded-xl flex items-stretch overflow-hidden">
                  <div className="bg-alt text-main w-[10%] text-3xl font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h2 className="text-2xl m-4 font-bold">{section.title}</h2>
                </div>
              </div>
              <div className="p-8 ">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutPage);
