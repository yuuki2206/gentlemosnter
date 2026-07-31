import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronDown, Plus } from "lucide-react";
import "@google/model-viewer";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BoldCollection = ({ story }) => {
  const [isPlayingHero, setIsPlayingHero] = useState(true);
  const [isMutedHero, setIsMutedHero] = useState(true);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  // States & Refs cho Video HAUS NOWHERE Store (Section 4)
  const [isPlayingStore, setIsPlayingStore] = useState(true);
  const [isMutedStore, setIsMutedStore] = useState(true);
  const [storeProgress, setStoreProgress] = useState(0);

  const heroVideoRef = useRef(null);
  const storeVideoRef = useRef(null);

  const toggleStorePlay = () => {
    if (storeVideoRef.current) {
      if (isPlayingStore) {
        storeVideoRef.current.pause();
        setIsPlayingStore(false);
      } else {
        storeVideoRef.current.play();
        setIsPlayingStore(true);
      }
    }
  };

  const toggleStoreMute = (e) => {
    e.stopPropagation();
    if (storeVideoRef.current) {
      storeVideoRef.current.muted = !isMutedStore;
      setIsMutedStore(!isMutedStore);
    }
  };

  const handleStoreTimeUpdate = () => {
    if (storeVideoRef.current) {
      const current = storeVideoRef.current.currentTime;
      const total = storeVideoRef.current.duration;
      if (total > 0) {
        setStoreProgress((current / total) * 100);
      }
    }
  };

  const handleStoreSeek = (e) => {
    e.stopPropagation();
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    if (storeVideoRef.current && storeVideoRef.current.duration) {
      storeVideoRef.current.currentTime = percentage * storeVideoRef.current.duration;
      setStoreProgress(percentage * 100);
    }
  };

  // 4 Biến thể màu sắc 3D linh hoạt cho Kính (CSS Shaders & Color Filters)
  const colorVariants = [
    {
      name: "Sigua MPV1",
      colorName: "Metallic Purple",
      hex: "#8b5cf6",
      filterStyle: "hue-rotate(220deg) saturate(1.8) brightness(1.05) contrast(1.1)",
      bgGradient: "from-purple-950/20 via-black to-black"
    },
    {
      name: "Sigua 01",
      colorName: "Black Chrome",
      hex: "#262626",
      filterStyle: "grayscale(1) brightness(0.9) contrast(1.3)",
      bgGradient: "from-neutral-900/30 via-black to-black"
    },
    {
      name: "Sigua B3",
      colorName: "Iridescent Silver",
      hex: "#d4d4d4",
      filterStyle: "brightness(1.25) contrast(1.05) saturate(0.8)",
      bgGradient: "from-slate-900/30 via-black to-black"
    },
    {
      name: "Sigua 02(BR)",
      colorName: "Rose Gold",
      hex: "#f43f5e",
      filterStyle: "hue-rotate(310deg) saturate(1.6) brightness(1.1)",
      bgGradient: "from-rose-950/20 via-black to-black"
    }
  ];

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isPlayingHero) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play();
      }
      setIsPlayingHero(!isPlayingHero);
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isMutedHero;
      setIsMutedHero(!isMutedHero);
    }
  };

  // 5 Ảnh Carousel Campaign
  const campaignImages = [
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel1.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel2.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel3.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel4.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel5.jpg",
  ];

  // 10 Ảnh không gian Pop-up HAUS NOWHERE
  const hausImages = [
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus1.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus2.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus3.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus4.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus5.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus6.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus7.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus8.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus9.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/haus10.jpg",
  ];

  // 8 Ảnh Celebs
  const celebImages = [
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb1.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb2.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb3.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb4.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb5.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb6.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb7.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb8.jpg",
  ];

  // 8 Sản phẩm BOLD Collection
  const boldProducts = [
    {
      name: "BOLD 01",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel1.jpg",
      sku: "BOLD-01"
    },
    {
      name: "BOLD 02(BR)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel2.jpg",
      sku: "BOLD-02BR"
    },
    {
      name: "BOLD B3",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel3.jpg",
      sku: "BOLD-B3"
    },
    {
      name: "BOLD 02",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel4.jpg",
      sku: "BOLD-02"
    },
    {
      name: "BOLD 03(V)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel5.jpg",
      sku: "BOLD-03V"
    },
    {
      name: "BOLD 04",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb1.jpg",
      sku: "BOLD-04"
    },
    {
      name: "BOLD 05(GR)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb2.jpg",
      sku: "BOLD-05GR"
    },
    {
      name: "BOLD 06",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/celeb3.jpg",
      sku: "BOLD-06"
    }
  ];

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80";
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="w-full bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Header màu tối với logo Gentle Monster */}
      <Header isDark={true} />

      {/* =========================================================================
          SECTION 1: HERO FULLSCREEN VIDEO ("BOLD 2025")
         ========================================================================= */}
      <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        {/* Fullscreen Background Video */}
        <video
          ref={heroVideoRef}
          src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/hero-pc.mp4"
          poster="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/hero-pc.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Video Overlay Tint */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Hero Overlay Title Text (Exact Match to Gentle Monster Official Website) */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 mt-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl tracking-[0.25em] font-serif font-light text-white uppercase leading-none drop-shadow-md">
            BOLD
          </h1>
          <p className="text-xs md:text-sm tracking-[0.25em] font-serif text-neutral-200 mt-2.5 font-light">
            2025
          </p>

          <button
            onClick={scrollToContent}
            className="mt-6 text-[10px] md:text-[11px] tracking-[0.2em] text-white/90 hover:text-white transition-colors cursor-pointer font-serif flex flex-col items-center gap-2.5 group"
          >
            <span>Explore 2025 BOLD Collection</span>
            
            {/* Single Vertical Scroll Line Indicator (Exact 100% Match to Official Site) */}
            <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-white/90 via-white/40 to-transparent mt-1 group-hover:from-white transition-colors" />
          </button>
        </div>

        {/* Play / Mute Minimal Controls Bottom Right */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <button
            onClick={toggleHeroPlay}
            aria-label={isPlayingHero ? "Pause video" : "Play video"}
            className="text-white hover:opacity-75 transition-opacity"
          >
            {isPlayingHero ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={toggleHeroMute}
            aria-label={isMutedHero ? "Unmute video" : "Mute video"}
            className="text-white hover:opacity-75 transition-opacity"
          >
            {isMutedHero ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: TILDA SWINTON VIDEO GALLERY
         ========================================================================= */}
      <section className="w-full bg-black text-center">
        {/* Full-width Edge-to-Edge Video Gallery Grid (Exact 100% Match to Official Website) */}
        <div className="w-full overflow-hidden border-none bg-black">
          
          {/* Top Row: 2-Column Videos Side-by-Side (video-gallery1 & video-gallery4) */}
          <div className="grid grid-cols-2 w-full gap-0">
            <div className="w-full aspect-[16/9] relative bg-black overflow-hidden">
              <video
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/video-gallery1-pc.mp4"
                poster="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/video-gallery1-pc.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full aspect-[16/9] relative bg-black overflow-hidden">
              <video
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/video-gallery4-pc.mp4"
                poster="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/video-gallery4-pc.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Row: 4 Synchronized Videos Side-by-Side (video-gallery6-pc.mp4) */}
          <div className="grid grid-cols-4 w-full gap-0">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="w-full aspect-[16/9] relative bg-black overflow-hidden">
                <video
                  src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/video-gallery6-pc.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SPACED DESIGN PHILOSOPHY & PORTRAIT CAMPAIGN IMAGE
         ========================================================================= */}
      <section className="w-full bg-black text-center">
        
        {/* Generous Black Distance / Spacing with Single Design Philosophy Text (Exact Match to Right Image) */}
        <div className="py-36 md:py-48 px-6 max-w-4xl mx-auto">
          <p className="text-[14px] md:text-[18px] leading-relaxed md:leading-[34px] text-[#A8A8A8] font-serif tracking-normal font-light">
            The BOLD Collection reinterprets the shield shape with a modern twist, redefining futurism through the removal of nose pads. Metal frames juxtapose lightweight lenses with a solid, intricately crafted bridge, while acetate frames embody a futuristic sensibility with exaggerated volume and a signature symbol evoking speed.
          </p>
        </div>

        {/* Large Portrait Campaign Image of Tilda Swinton (Exact Match to Right Image) */}
        <div className="w-full max-w-[680px] md:max-w-[780px] mx-auto aspect-[3/4] relative overflow-hidden bg-black shadow-2xl mb-24 group">
          <img
            src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel2.jpg"
            alt="Tilda Swinton BOLD Collection"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

      </section>

      {/* =========================================================================
          SECTION 3.5: 3D INTERACTIVE MODEL EXPERIENCE ("HOLD AND SPIN")
         ========================================================================= */}
      <section className="w-full bg-black py-28 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center gap-32">
          
          {/* ==========================================
              MODEL 1: SIGUA MPV1 (Metallic Purple) - Enlarged +40%
             ========================================== */}
          <div className="w-full flex flex-col items-center relative">
            <div className="relative w-full max-w-[880px] md:max-w-[1000px] aspect-[16/10] md:aspect-[16/9] flex items-center justify-center group cursor-grab active:cursor-grabbing">
              
              {/* Overlay HOLD AND SPIN Cursor Badge (Exact Match to Web Gốc) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-white uppercase font-light drop-shadow-md">
                  HOLD AND SPIN
                </span>
                <Plus size={14} className="text-white animate-pulse" />
              </div>

              {/* 3D Model Renderer for Sigua MPV1 (Enlarged +40%) */}
              <model-viewer
                src="/models/sigua_mpv1.glb"
                alt="Sigua MPV1 3D Eyewear"
                auto-rotate
                camera-controls
                shadow-intensity="1.5"
                exposure="1.2"
                interaction-prompt="none"
                scale="1.4 1.4 1.4"
                style={{
                  width: "100%",
                  height: "100%",
                  filter: "hue-rotate(240deg) saturate(1.8) brightness(1.05)",
                  transition: "filter 0.5s ease"
                }}
              >
                <div slot="poster" className="w-full h-full flex items-center justify-center">
                  <img
                    src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel5.jpg"
                    alt="Sigua MPV1 Preview"
                    className="w-[90%] md:w-full h-auto object-contain transition-all duration-500 scale-125 drop-shadow-[0_20px_50px_rgba(139,92,246,0.35)]"
                    style={{
                      filter: "hue-rotate(240deg) saturate(1.8) brightness(1.05)"
                    }}
                  />
                </div>
              </model-viewer>
            </div>

            {/* Model Title Below */}
            <p className="font-serif text-sm md:text-base tracking-[0.2em] uppercase text-white font-light mt-4">
              Sigua MPV1
            </p>
          </div>

          {/* ==========================================
              MODEL 2: PILOT MO21 (Red Lenses Sports) - Enlarged +40%
             ========================================== */}
          <div className="w-full flex flex-col items-center relative">
            <div className="relative w-full max-w-[880px] md:max-w-[1000px] aspect-[16/10] md:aspect-[16/9] flex items-center justify-center group cursor-grab active:cursor-grabbing">
              
              {/* Overlay HOLD AND SPIN Cursor Badge (Exact Match to Web Gốc) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-white uppercase font-light drop-shadow-md">
                  HOLD AND SPIN
                </span>
                <Plus size={14} className="text-white animate-pulse" />
              </div>

              {/* 3D Model Renderer for Pilot MO21 (Enlarged +40%) */}
              <model-viewer
                src="/models/pilot_mo21.glb"
                alt="Pilot MO21 3D Eyewear"
                auto-rotate
                camera-controls
                shadow-intensity="1.5"
                exposure="1.2"
                interaction-prompt="none"
                scale="1.4 1.4 1.4"
                style={{
                  width: "100%",
                  height: "100%",
                  filter: "hue-rotate(330deg) saturate(2.2) brightness(1.1)",
                  transition: "filter 0.5s ease"
                }}
              >
                <div slot="poster" className="w-full h-full flex items-center justify-center">
                  <img
                    src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/image/campaign-carousel4.jpg"
                    alt="Pilot MO21 Preview"
                    className="w-[90%] md:w-full h-auto object-contain transition-all duration-500 scale-125 drop-shadow-[0_20px_50px_rgba(239,68,68,0.35)]"
                    style={{
                      filter: "hue-rotate(330deg) saturate(2.2) brightness(1.1)"
                    }}
                  />
                </div>
              </model-viewer>
            </div>

            {/* Model Title Below */}
            <p className="font-serif text-sm md:text-base tracking-[0.2em] uppercase text-white font-light mt-4">
              Fuse MGR1
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HAUS NOWHERE POP-UP STORE EXHIBITION & LOCATIONS
         ========================================================================= */}
      <section className="w-full bg-black py-32 text-center">
        <div className="max-w-[880px] mx-auto px-4 flex flex-col items-center">
          
          {/* Pop-Up Description Text (Exact Match to Web Gốc) */}
          <p className="text-[13px] md:text-[15px] leading-relaxed md:leading-[26px] text-[#A8A8A8] font-serif max-w-xl mx-auto mb-14 font-light">
            Exclusive pop-ups will be held in Seoul, Beijing and Tokyo to celebrate the 2025 BOLD Collection launch. Drawing from the iconic silhouettes and textures of HAUS NOWHERE Seoul, the spaces form an innovative visual concept that merges fashion with architecture.
          </p>

          {/* Centered Vertical Store Video Banner with Interactive Play/Pause & Seek Bar */}
          <div
            onClick={toggleStorePlay}
            className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[9/16] overflow-hidden bg-black shadow-2xl mb-16 mx-auto group cursor-pointer"
          >
            <video
              ref={storeVideoRef}
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/bold/video/haus-nowhere-seoul-fog.mp4"
              autoPlay
              loop
              muted={isMutedStore}
              playsInline
              onTimeUpdate={handleStoreTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Play / Pause Badge in Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="font-mono text-[12px] md:text-[13px] tracking-[0.25em] text-white/90 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium transition-transform group-hover:scale-110">
                {isPlayingStore ? "PAUSE" : "PLAY"}
              </span>
            </div>

            {/* Bottom Controls Bar: Progress Slider + Mute Toggle (Exact Match to Web Gốc) */}
            <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center gap-3">
              
              {/* Rounded Capsule Progress Bar */}
              <div
                onClick={handleStoreSeek}
                className="relative flex-1 h-3.5 md:h-4 rounded-full border border-white/80 bg-black/20 backdrop-blur-sm cursor-pointer flex items-center px-1"
              >
                {/* Progress Dot Indicator (Exact Match to Web Gốc) */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-neutral-200 shadow-md transition-all duration-75 -translate-x-1/2"
                  style={{ left: `clamp(6px, ${storeProgress}%, calc(100% - 6px))` }}
                />
              </div>

              {/* Mute / Unmute Toggle Button */}
              <button
                onClick={toggleStoreMute}
                aria-label={isMutedStore ? "Unmute video" : "Mute video"}
                className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-white uppercase font-medium hover:text-white/80 transition-colors whitespace-nowrap pl-1 cursor-pointer"
              >
                {isMutedStore ? "UNMUTE" : "MUTE"}
              </button>

            </div>
          </div>

          {/* 3 Store Locations Addresses (Exact Match to Screenshot) */}
          <div className="flex flex-col items-center gap-6 text-center font-serif">
            
            {/* Location 1: Seoul */}
            <div>
              <p className="text-[#A8A8A8] text-xs md:text-sm tracking-wide font-light">
                HAUS NOWHERE Seoul
              </p>
              <p className="text-[#6E6E6E] text-[11px] md:text-xs tracking-normal font-light mt-0.5">
                2F, 433 Ttukseom-ro, Seongdong-gu, Seoul
              </p>
            </div>

            {/* Location 2: Tokyo */}
            <div>
              <p className="text-[#A8A8A8] text-xs md:text-sm tracking-wide font-light">
                GENTLE MONSTER Tokyo Aoyama
              </p>
              <p className="text-[#6E6E6E] text-[11px] md:text-xs tracking-normal font-light mt-0.5">
                5-chome-3-2 Minamiaoyama, Minato City, Tokyo 107-0062
              </p>
            </div>

            {/* Location 3: Beijing */}
            <div>
              <p className="text-[#A8A8A8] text-xs md:text-sm tracking-wide font-light">
                GENTLE MONSTER Beijing Sanlitun Taikoo Li
              </p>
              <p className="text-[#6E6E6E] text-[11px] md:text-xs tracking-normal font-light mt-0.5">
                1F S10-15, 2F S10-23 & 3F S10-32, South Zone, Taikoo Li Sanlitun, 19# Sanlitun Rd, Chaoyang District, Beijing
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: GUESTS & EXHIBITION SWIPER CAROUSEL
         ========================================================================= */}
      <section className="w-full bg-black py-28 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Column: Swipe Indicator & Description Text */}
          <div className="w-full md:w-1/4 flex flex-col items-center md:items-start text-center md:text-left justify-center pr-0 md:pr-6 shrink-0">
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-[#A8A8A8] uppercase mb-4 font-light">
              « SWIPE »
            </span>
            <p className="font-serif text-[13px] md:text-[15px] leading-relaxed text-[#A8A8A8] font-light max-w-xs">
              Meet the guests who visited the BOLD Collection pop-up.
            </p>
          </div>

          {/* Right Column: Swiper Carousel of Celebrity Guests & Exhibition Photos */}
          <div className="w-full md:w-3/4 overflow-hidden">
            <Swiper
              modules={[FreeMode]}
              freeMode={true}
              grabCursor={true}
              slidesPerView={'auto'}
              spaceBetween={0}
              className="w-full mySwiper"
            >
              {celebImages.concat(hausImages).map((img, idx) => (
                <SwiperSlide key={idx} className="!w-[280px] sm:!w-[340px] md:!w-[420px] shrink-0">
                  <div className="w-full h-[400px] sm:h-[480px] md:h-[580px] overflow-hidden bg-neutral-900 border-r border-black/50">
                    <img
                      src={img}
                      alt={`Guest & Exhibition ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </section>

      {/* Footer màu đen tối giản */}
      <Footer darkMode={true} />
    </div>
  );
};

export default BoldCollection;
