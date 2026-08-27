import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CC from "./eventImages/CC.png";
import A2A from "./eventImages/A2A.png";
import C4C from "./eventImages/C4C.png";

gsap.registerPlugin(ScrollTrigger);

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

  // Hovered Card State
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Clear refs on every render to prevent infinite growth
  cardsRef.current = [];
  descRef.current = [];
  titleRef.current = [];

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };
  const addToDescRef = (el) => {
    if (el && !descRef.current.includes(el)) descRef.current.push(el);
  };
  const addToTitleRef = (el) => {
    if (el && !titleRef.current.includes(el)) titleRef.current.push(el);
  };

  useEffect(() => {
    cardsRef.current.forEach((el) => {
      if (!el) return;
      
      const isCardHovered = el.dataset.hovered === "true";
      
      const match = el.dataset.rotation?.match(/(-)?rotate-(\d+)/);
      const baseRot = match ? (match[1] ? -1 : 1) * parseInt(match[2], 10) : 0;

      gsap.to(el, {
        rotation: isCardHovered ? 0 : baseRot,
        duration: 0.25,
        ease: "power1.out",
        overwrite: "auto", 
      });
    });
  }, [hoveredCardId]);

  useGSAP(
  () => {
    if (!containerRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const container = containerRef.current;
    const titles = titleRef.current;

    const parseRotationDeg = (cls) => {
      if (!cls) return 0;
      const match = cls.match(/(-)?rotate-(\d+)/);
      if (!match) return 0;
      const isNegative = Boolean(match[1]);
      const val = parseInt(match[2], 10);
      return (isNegative ? -1 : 1) * val;
    };

    const maxScroll = track.scrollWidth - window.innerWidth;
    if (maxScroll <= 0) return;

    const slowdownRadius = 220; // Radius (px) around screen center where slowdown occurs
    const slowFactor = 2.65; // How many times slower to move inside the zone 

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    const trackBounds = track.getBoundingClientRect();
    const targets = titles
      .map((titleEl) => {
        if (!titleEl) return null;
        const rect = titleEl.getBoundingClientRect();
        const relativeLeft = rect.left - trackBounds.left + rect.width / 2;
        const targetTrackX = -(relativeLeft - window.innerWidth / 2);
        return Math.min(0, Math.max(-maxScroll, targetTrackX));
      })
      .filter((val) => val !== null)
      .sort((a, b) => b - a); 

    let currentX = 0;

    targets.forEach((targetX) => {
      const slowStart = Math.max(-maxScroll, Math.min(0, targetX + slowdownRadius));
      const slowEnd = Math.max(-maxScroll, Math.min(0, targetX - slowdownRadius));

      // 1. Normal movement up to the slowdown zone
      const distNormal = Math.abs(slowStart - currentX);
      if (distNormal > 0) {
        tl.to(track, { x: slowStart, duration: distNormal });
      }

      // 2. Slow movement through the title center zone
      const distSlow = Math.abs(slowEnd - slowStart);
      if (distSlow > 0) {
        tl.to(track, { x: slowEnd, duration: distSlow * slowFactor });
      }

      currentX = slowEnd;
    });

    // 3. Normal movement from last slow zone to the end of the track
    const finalDist = Math.abs(-maxScroll - currentX);
    if (finalDist > 0) {
      tl.to(track, { x: -maxScroll, duration: finalDist });
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${tl.duration()}`,
      pin: true,
      animation: tl,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const scrollTilt = gsap.utils.clamp(-6, 6, velocity * -0.003);

        const centerX = window.innerWidth / 2;
        const maxDist = window.innerWidth / 2;

        descRef.current.forEach((el) => {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const elCenter = rect.left + rect.width / 2;
  const dist = Math.abs(centerX - elCenter);
  const progress = Math.max(0, 1 - dist / maxDist);
  const fadeOpacity = Math.pow(progress, 3);

  const distRatio = (elCenter - centerX) / maxDist;

  const maxShift = 150;
  const xShift = -distRatio * maxShift;

  gsap.to(el, {
    x: xShift,
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
          const directionalScrollTilt = scrollTilt * tiltMultiplier;

          gsap.to(el, {
            rotation: isCardHovered ? 0 : baseRot + directionalScrollTilt,
            duration: 0.25,
            ease: "power1.out",
            overwrite: "auto",
          });
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  },
  { scope: containerRef }
);

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
    <section id="events" className="relative w-full bg-[#030a16]">
      <div 
        ref={containerRef} 
        className="w-full h-screen overflow-hidden bg-[#030a16] text-slate-100 relative"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-76 h-66 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />

        <h2 className="absolute top-10 left-10 md:left-20 text-5xl font-bold z-10 text-red-400 text-shadow-2xl [text-shadow:_4px_4px_6px_theme(colors.black)]">
          Events
        </h2>

        {/* The Track that moves horizontally */}
        <div
          ref={trackRef}
          className="flex h-full w-max items-center pt-20 px-12 md:px-28"
        >
          <div className="flex items-center space-x-10 md:space-x-16 h-full py-12 pr-48">
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-0 md:space-x-16 h-full py-4 px-12">
                <div className="mx-6"></div>
                
                {/* Section 1: Start Up Street */}
                <div className="flex flex-col items-center space-x-12 md:space-x-16 h-full py-2 px-16">
                  <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-3xl md:text-5xl font-bold tracking-wider uppercase pl-0 pr-3 mb-3">
                    <span ref={addToTitleRef}>Start Up Street</span>
                  </div>
                  <span ref={addToDescRef} className="text-slate-400 text-[1.25rem] font-normal tracking-wide w-[90vw] md:w-[600px] pb-2 text-center">
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
                  <span ref={addToDescRef} className="text-slate-300 text-[1.25rem] font-normal tracking-wide w-[90vw] md:w-[600px] pb-2 transition-colors text-center">
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
                  <span ref={addToDescRef} className="text-slate-400 text-[1.25rem] font-normal tracking-wide w-[90vw] md:w-[600px] pb-2 text-center">
                    A Transformative Three-day Event at Yantra, featuring ideathons, hackathons, and inspiring talks. Ignite creativity, collaborate, and pitch innovative solutions for a better tomorrow!
                  </span>
                  <div className="flex flex-row items-center space-x-10 md:space-x-16 h-full py-12 pl-12">
                    {renderCardList(c4c)}
                  </div>
                </div>
              </div>
              <div className="drop-shadow-black shadow-2xs shrink-0 flex items-center space-x-3 text-red-300 text-s font-medium tracking-wider uppercase pl-0 pr-3">
                <span className="animate-bounce">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;