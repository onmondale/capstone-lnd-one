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

import BookCoverSVG from "../../assets/icons/book.svg";
import { imageUrls } from "../../utils/imageUrls";

import { debounce } from "lodash";
import { booksContent } from "./content";

const LiteratureReview: React.FC = () => {
  const { currentTheme } = useTimeContext();
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const updateActiveSection = useCallback(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const container = containerRef.current;
    const { scrollTop, clientHeight } = container;
    const middleOfScreen = scrollTop + clientHeight / 2;

    for (let i = 0; i < booksContent.length; i++) {
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

  const bookHeights = useMemo(
    () => booksContent.map(() => Math.floor(Math.random() * 50) + 100),
    [],
  );

  if (!isClient) {
    return null; // or a loading spinner
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
          <div className="flex flex-col p-6 pl-8">
            <div className="flex justify-between items-end">
              <div className="w-1/2 flex justify-start items-end">
                {booksContent.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: `${bookHeights[i]}px`,
                      marginLeft: "-1px",
                    }}
                    className={`w-8 flex flex-col justify-end border border-alt cursor-pointer ${
                      activeSection === i
                        ? "bg-alt text-main"
                        : "bg-main text-alt"
                    }`}
                    onClick={() => scrollToSection(i)}
                  >
                    <div className="text-center pb-1">{i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="w-1/2 flex flex-col items-start ml-4">
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
            <div className="pt-4">
              <div className="mt-2">
                {booksContent.map((book, index) => (
                  <p
                    key={index}
                    className={`mb-2 cursor-pointer text-sm ${
                      activeSection === index ? "underline" : ""
                    }`}
                    onClick={() => scrollToSection(index)}
                  >
                    {`${index + 1}. `}
                    <span className="italic">{book.title}</span>
                    {" by "}
                    {book.author}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="container-box overflow-y-auto" ref={containerRef}>
          <div className="p-8 border-b border-alt">
            <div className="flex flex-col items-center m-6 p-4 pt-6 border rounded-xl">
              <h1 className="text-6xl font-bold mb-4">Literature Review</h1>
              <p className="text-lg mb-8 leading-relaxed max-w-3xl">
                This literature review features my interpretations and
                discussions of key academic texts that inform this project.
                Navigate the sources using the sidebar by clicking on either a
                book on the shelf or the header of source in the list.{" "}
                <strong>
                  Please note that each source features a button that links you
                  to an external site where you can view the source.
                </strong>
              </p>
            </div>
          </div>
          {booksContent.map((book, index) => (
            <div
              key={index}
              className="p-8 border-b border-alt"
              id={`section-${index}`}
            >
              <div className="w-full flex">
                <div className="h-[250px] flex items-center justify-center px-8 relative">
                  <div className="h-[200px] flex items-center justify-center relative">
                    <img
                      src={book.coverImage}
                      alt={`Cover of ${book.title} by ${book.author}`}
                      className="absolute bottom-0 left-0 w-[90.21%] h-[91.388%]"
                    />
                    <BookCoverSVG className="h-[100%] w-auto relative z-10" />
                  </div>
                </div>
                <div className="flex flex-col justify-center pl-2 pr-[25%] py-6 gap-4">
                  <h2 className="text-2xl font-bold">
                    {book.title} ({book.year})
                  </h2>
                  <h3 className="text-lg -mt-2 font-medium">
                    by {book.author}
                  </h3>
                  {book.link && (
                    <div className="flex gap-2">
                      <a
                        href={book.link}
                        className="px-8 py-2 border rounded-full hover:underline hover:bg-alt hover:text-main"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {book.linkText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <p
                className="text-sm mt-8"
                dangerouslySetInnerHTML={{ __html: book.content }}
              ></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LiteratureReview);
