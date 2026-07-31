import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CC from "./eventImages/CC.png";
import A2A from "./eventImages/A2A.png";
import C4C from "./eventImages/C4C.png";

gsap.registerPlugin(ScrollTrigger, Draggable);

const Events = () => {
  const ss = [
    { id: "01", title: "Start Up Street X", subtitle: "2025", image: CC, offset: "-translate-y-16", rotation: "rotate-3", height: "h-[120px] md:h-[220px]", width: "w-[100px] md:w-[200px]" },
    { id: "02", title: "Start Up Street IX", subtitle: "2024", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800", offset: "translate-y-24", rotation: "rotate-2", height: "h-[60px] md:h-[130px]", width: "w-[80px] md:w-[170px]" },
    { id: "03", title: "Start up Street IIIV", subtitle: "2023", image: CC, offset: "-translate-y-6", rotation: "-rotate-5", height: "h-[160px] md:h-[260px]", width: "w-[120px] md:w-[240px]" },
    { id: "04", title: "Start Up Street IIV", subtitle: "2022", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800", offset: "translate-y-12", rotation: "rotate-3", height: "h-[60px] md:h-[140px]", width: "w-[80px] md:w-[180px]" },
  ];

  const a2a = [
    { id: "05", title: "Auction 2 Action III", subtitle: "2025", image: A2A, offset: "-translate-y-18", rotation: "-rotate-2", height: "h-[100px] md:h-[190px]", width: "w-[140px] md:w-[260px]" },
    { id: "06", title: "Auction 2 Action II", subtitle: "2024", image: A2A, offset: "translate-y-32", rotation: "rotate-5", height: "h-[40px] md:h-[110px]", width: "w-[70px] md:w-[150px]" },
    { id: "07", title: "Auction 2 Action I", subtitle: "2023", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800", offset: "-translate-y-10", rotation: "-rotate-3", height: "h-[140px] md:h-[230px]", width: "w-[110px] md:w-[220px]" },
  ];

  const c4c = [
    { id: "09", title: "Code 4 Change 25", subtitle: "2025", image: C4C, offset: "-translate-y-18", rotation: "-rotate-4", height: "h-[110px] md:h-[200px]", width: "w-[130px] md:w-[250px]" },
    { id: "10", title: "Code 4 Change 24", subtitle: "2024", image: C4C, offset: "translate-y-20", rotation: "rotate-2", height: "h-[50px] md:h-[120px]", width: "w-[70px] md:w-[160px]" },
    { id: "11", title: "Code 4 Change 23", subtitle: "2023", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800", offset: "translate-y-18", rotation: "-rotate-5", height: "h-[130px] md:h-[240px]", width: "w-[120px] md:w-[230px]" },
    { id: "12", title: "Code 4 Change 22", subtitle: "2022", image: C4C, offset: "-translate-y-16", rotation: "rotate-3", height: "h-[70px] md:h-[150px]", width: "w-[80px] md:w-[170px]" },
  ];

  // Refs
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const descRef = useRef([]);
  const titleRef = useRef([]);

  // Drag & Scroll State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hovered Card State
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Custom Cursor Position State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Ref Collector Callbacks
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const addToDescRef = (el) => {
    if (el && !descRef.current.includes(el)) {
      descRef.current.push(el);
    }
  };

  const addToTitleRef = (el) => {
    if (el && !titleRef.current.includes(el)) {
      titleRef.current.push(el);
    }
  };

  // Update scroll progress indicator
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  // Dragging Handlers
  const startDragging = (clientX) => {
    setIsDragging(true);
    setStartX(clientX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseDown = (e) => startDragging(e.clientX);
  const handleTouchStart = (e) => startDragging(e.touches[0].clientX);

  const stopDragging = () => {
    setIsDragging(false);
  };

  const moveDragging = (clientX) => {
    if (!isDragging || !containerRef.current) return;
    const x = clientX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    moveDragging(e.clientX);
  };

  const handleTouchMove = (e) => {
    moveDragging(e.touches[0].clientX);
  };

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      const draggable = Draggable.create(trackRef.current, {
        type: "x",
        bounds: containerRef.current,
        edgeResistance: 0.65,
        dragClickables: false,
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false),
      })[0];

      let lastX = draggable.x;

      const parseRotationDeg = (cls) => {
  if (!cls) return 0;
  const match = cls.match(/(-)?rotate-(\d+)/);
  if (!match) return 0;
  const isNegative = Boolean(match[1]);
  const val = parseInt(match[2], 10);
  return (isNegative ? -1 : 1) * val;
};

      function updateCenterFocus() {
        if (!containerRef.current) return;

        const currentX = draggable.x;
        const deltaX = currentX - lastX;
        lastX = currentX;

        const dragTilt = gsap.utils.clamp(-6, 6, -deltaX * 0.35);

        const containerBounds = containerRef.current.getBoundingClientRect();
        const centerX = containerBounds.left + containerBounds.width / 2;
        const maxDist = containerBounds.width / 2;

        descRef.current.forEach((el) => {
          if (!el) return;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.left + rect.width / 2;
            const dist = Math.abs(centerX - elCenter);
  
            const progress = Math.max(0, 1 - dist / maxDist);

            const fadeOpacity = Math.pow(progress, 3);

            gsap.to(el, {
              opacity: fadeOpacity,
              color: gsap.utils.interpolate("#cbd5e1", "#fbbf24", progress),
              duration: 0.1,
              overwrite: "auto",
            });
        });

        titleRef.current.forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.left + rect.width / 2;
          const dist = Math.abs(centerX - elCenter);
          const progress = Math.max(0, 1 - dist / maxDist);

          const glowBlur = gsap.utils.interpolate(0, 20, progress);
          const glowAlpha = gsap.utils.interpolate(0, 0.8, progress);

          gsap.to(el, {
            color: gsap.utils.interpolate("#ffffff", "#dc2626", progress),
            filter: `drop-shadow(0px 0px ${glowBlur}px rgba(239, 68, 68, ${glowAlpha}))`,
            duration: 0.1,
            overwrite: "auto",
          });
        });

        cardsRef.current.forEach((el, index) => {
          if (!el) return;
            const isCardHovered = el.dataset.hovered === "true";
            const baseRot = parseRotationDeg(el.dataset.rotation);

            const tiltMultiplier = index % 2 === 0 ? 1 : -1;
            const directionalDragTilt = dragTilt * tiltMultiplier;

            gsap.to(el, {
              rotation: isCardHovered ? 0 : baseRot + directionalDragTilt,
              duration: 0.25,
              ease: "power1.out",
              overwrite: "auto",
            });
        });
      }

      gsap.ticker.add(updateCenterFocus);

      return () => {
        gsap.ticker.remove(updateCenterFocus);
      };
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const renderCardList = (list) =>
    list.map((item) => {
      const isCardHovered = hoveredCardId === item.id;
      return (
        <div
          key={item.id}
          className={`pt-8 transition-all duration-300 ease-out ${
            isCardHovered ? "translate-y-0" : item.offset
          }`}
        >
          <div
            ref={addToCardsRef}
            data-rotation={item.rotation}
            data-hovered={isCardHovered}
            onMouseEnter={() => setHoveredCardId(item.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            <div
              className={`group relative ${item.width} ${item.height} shrink-0 rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 backdrop-blur-xl transition-all duration-1000 shadow-black shadow-lg hover:border-red-600/40 hover:shadow-red-600/10 hover:shadow-2xl hover:scale-125 ease-out`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  draggable="false"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030a16] via-[#030a16]/40 to-transparent" />
              </div>

              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                <span className="text-s font-mono text-red-400/80 tracking-widest">
                  {item.subtitle}
                </span>
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-light text-white group-hover:text-red-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

  return (
    <section id="events" className="min-h-screen py-10 w-full overflow-x-hidden">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#030a16]">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
        <h2 className="text-5xl font-bold mb-6 px-20 pt-5 text-amber-700 text-shadow-2xl [text-shadow:_4px_4px_6px_theme(colors.black)]">Events</h2>
        <div className="relative w-full h-[95vh] bg-[#030a16] text-slate-100 overflow-hidden font-sans select-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-76 h-66 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />

          {/* Custom Cursor */}
          <div
            className={`fixed top-0 left-0 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out ${
              isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
            }}
          >
            <div
              className={`flex items-center justify-center rounded-full border border-red-400/50 backdrop-blur-md transition-all duration-300 ${
                isDragging ? "w-6 h-6 bg-red-500/30 scale-110" : "w-10 h-10 bg-red-950/60"
              }`}
            >
              <span className="text-[18px] font-bold tracking-widest uppercase text-white-200">
                {isDragging ? "" : "↔"}
              </span>
            </div>
          </div>

          {/* Main Horizontal Drag Container */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={stopDragging}
            onMouseLeave={() => {
              stopDragging();
              setIsHovered(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={stopDragging}
            onTouchMove={handleTouchMove}
            className="w-full h-full flex items-center overflow-x-scroll scrollbar-none px-12 md:px-28 cursor-grab active:cursor-grabbing transition-all duration-150 ease-out"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div>
              <div ref={trackRef} className="flex items-center space-x-10 md:space-x-16 h-full py-12 px-12 pr-48">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-0 md:space-x-16 h-full py-4 px-12">
                    
                    {/* Section 1: Start Up Street */}
                    <div className="flex flex-col items-center space-x-10 md:space-x-16 h-full py-2 px-12">
                      <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-3xl md:text-5xl font-bold tracking-wider uppercase pl-0 pr-3 mb-3">
                        <span ref={addToTitleRef}>Start Up Street</span>
                      </div>
                      <span ref={addToDescRef} className="text-slate-400 text-[1.25rem] font-normal tracking-wide w-0 md:w-200 pb-2 text-center">
                        Teams pitching big ideas to top investors, collaborated on UN SDGs, and heard inspiring talks from leading social entrepreneurs.
                      </span>
                      <div className="flex flex-row items-center space-x-10 md:space-x-16 h-full py-12 px-12">
                        {renderCardList(ss)}
                      </div>
                    </div>

                    {/* Section 2: Auction 2 Action */}
                    <div className="flex flex-col items-center space-x-10 md:space-x-16 h-full py-2 px-12">
                      <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-3xl md:text-5xl font-bold tracking-wider uppercase pl-0 pr-3 mb-3">
                        <span ref={addToTitleRef}>Auction 2 Action</span>
                      </div>
                      <span ref={addToDescRef} className="text-slate-300 text-[1.25rem] font-normal tracking-wide w-0 md:w-200 pb-2 transition-colors text-center">
                        A thrilling blend of bidding, teamwork and creativity where participants competed for resources, joined forces to build a final product and showcased their ideas with confidence.
                      </span>
                      <div className="flex flex-row items-center space-x-10 md:space-x-16 h-full py-12 px-12">
                        {renderCardList(a2a)}
                      </div>
                    </div>

                    {/* Section 3: Code 4 Change */}
                    <div className="flex flex-col items-center space-x-10 md:space-x-16 h-full py-2 pl-12">
                      <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-3xl md:text-5xl font-bold tracking-wider uppercase pl-0 pr-3 mb-3">
                        <span ref={addToTitleRef}>Code 4 Change</span>
                      </div>
                      <span ref={addToDescRef} className="text-slate-400 text-[1.25rem] font-normal tracking-wide w-0 md:w-200 pb-2 text-center">
                        A Transformative Three-day Event at Yantra, featuring ideathons, hackathons, and inspiring talks. Ignite creativity, collaborate, and pitch innovative solutions for a better tomorrow!
                      </span>
                      <div className="flex flex-row items-center space-x-10 md:space-x-16 h-full py-12 pl-12">
                        {renderCardList(c4c)}
                      </div>
                    </div>

                  </div>
                  <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-s font-medium tracking-wider uppercase pl-0 pr-3">
                    <span>Click & Drag Left or Right</span>
                    <span className="animate-bounce">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;