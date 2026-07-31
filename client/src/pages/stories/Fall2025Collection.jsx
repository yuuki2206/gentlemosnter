import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { handleImageError } from "../../config/media";
import { CartContext } from "../../context/CartContext";
import { Volume2, VolumeX, Play, Pause, ArrowRight, Shield, Sparkles } from "lucide-react";

/**
 * Fall2025Collection Component
 * Gentle Monster 2025 Fall Collection - "THE HUNT" Campaign starring Hunter Schafer, directed by Nadia Lee Cohen.
 */
const Fall2025Collection = ({ story }) => {
  const { addToCart } = useContext(CartContext);

  // State cho Hero Campaign Video
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoRef = useRef(null);

  // State cho Interactive Campaign Gallery (Section 2)
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);

  // State cho Section 3 Retro Doorbell (Click Buzz In -> Switch to Axe Video)
  const [isBuzzed, setIsBuzzed] = useState(false);
  const doorbellVideoRef = useRef(null);

  // State cho Interactive Game Modal
  const [showGameModal, setShowGameModal] = useState(false);

  const handleBuzzIn = () => {
    setIsBuzzed(true);
    if (doorbellVideoRef.current) {
      doorbellVideoRef.current.currentTime = 0;
      doorbellVideoRef.current.play().catch(() => {});
    }
  };

  const handleDoorbellEnded = () => {
    setIsBuzzed(false);
  };

  const togglePlay = () => {
    if (heroVideoRef.current) {
      if (isPlayingVideo) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  const toggleMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Danh sách 8 mẫu kính thuộc 2025 Fall Collection
  const fallProducts = [
    {
      sku: "ROLLIE-02",
      name: "Rollie 02",
      price: 9450000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_01_Rollie_02.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_01_Rollie_02_mob.jpg",
      description: "Minimalist rectangular frame in silver with sleek metal temples."
    },
    {
      sku: "ROLLIE-02BR",
      name: "Rollie 02(BR)",
      price: 9450000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_02_Rollie_02BR.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_02_Rollie_02BR_mob.jpg",
      description: "Brown tinted lenses paired with elevated silver wire-frame details."
    },
    {
      sku: "HEAVENLY-B3",
      name: "Heavenly B3",
      price: 10200000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_03_Heavenly_B3.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_03_Heavenly_B3_mob.jpg",
      description: "Cat-eye shape with gradient brown lenses and refined metallic lines."
    },
    {
      sku: "HEAVENLY-02",
      name: "Heavenly 02",
      price: 10200000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_04_Heavenly_02.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_04_Heavenly_02_mob.jpg",
      description: "Silver metal cat-eye frame featuring clean architectural curves."
    },
    {
      sku: "MOODY-02BR",
      name: "Moody 02(BR)",
      price: 9800000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_05_Moody_02BR.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_05_Moody_02BR_mob.jpg",
      description: "Warm brown tint with rimless oval structure."
    },
    {
      sku: "MOODY-02",
      name: "Moody 02",
      price: 9800000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_06_Moody_02.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_06_Moody_02_mob.jpg",
      description: "Ultra-lightweight metallic frame with clear gradient lenses."
    },
    {
      sku: "BOBA-BL8",
      name: "Boba BL8",
      price: 11100000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_07_Boba_BL8.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_07_Boba_BL8_mob.jpg",
      description: "Bold blue tint lenses encased in a structured acetate frame."
    },
    {
      sku: "BOBA-02",
      name: "Boba 02",
      price: 11100000,
      image: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_08_Boba_02.jpg",
      mobImage: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_08_Boba_02_mob.jpg",
      description: "Classic silver statement frame with dark grey protective lenses."
    }
  ];

  const campaignImages = [
    {
      pc: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_1_campaign_imgs_pc_1600x1080.jpg",
      mob: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_1_campaign_imgs_mob_1080*1350.jpg",
      modelName: "Limes 02",
      productSku: "LIMES-02"
    },
    {
      pc: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_2_campaign_imgs_pc_1600x1080.jpg",
      mob: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_2_campaign_imgs_mob_1080*1350.jpg",
      modelName: "Rollie 02",
      productSku: "ROLLIE-02"
    },
    {
      pc: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_3_campaign_imgs_pc_1600x1080.jpg",
      mob: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_3_campaign_imgs_mob_1080*1350.jpg",
      modelName: "Monica R11",
      productSku: "MONICA-R11"
    },
    {
      pc: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_4_campaign_imgs_pc_1600x1080.jpg",
      mob: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_4_campaign_imgs_mob_1080*1350.jpg",
      modelName: "Limes 02",
      productSku: "LIMES-02"
    },
    {
      pc: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_5_campaign_imgs_pc_1600x1080.jpg",
      mob: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_5_campaign_imgs_mob_1080*1350.jpg",
      modelName: "Moody 02(BR)",
      productSku: "MOODY-02BR"
    }
  ];

  // 5 Tác phẩm chi tiết thuộc Section 4 (Uncover 2025 FALL Collection Grid Match 100%)
  const detailItems = [
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_1_product_imgs_1080x1350.jpg",
      video: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section4/story_1_product_video_1080x1350.mp4",
      modelName: "Monica R11",
      sku: "MONICA-R11"
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_2_product_imgs_1080_1350.jpg",
      modelName: "Heavenly B3",
      sku: "HEAVENLY-B3"
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_3_product_imgs_1080x1350.jpg",
      video: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section4/story_3_product_video_1080x1350_1.mp4",
      modelName: "Boba BL8",
      sku: "BOBA-BL8"
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_4_product_imgs_1080_1350.jpg",
      modelName: "Rollie 02(BR)",
      sku: "ROLLIE-02BR"
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section4/story_5_product_imgs_1080_1350.jpg",
      modelName: "Moody 02",
      sku: "MOODY-02"
    }
  ];

  // 8 Sản phẩm thuộc Section 5: Shop the Collection (Match Web Gốc 100%)
  const shopCollectionItems = [
    {
      name: "Rollie 02",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_01_Rollie_02.jpg",
      sku: "ROLLIE-02"
    },
    {
      name: "Rollie 02(BR)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_02_Rollie_02BR.jpg",
      sku: "ROLLIE-02BR"
    },
    {
      name: "Heavenly B3",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_03_Heavenly_B3.jpg",
      sku: "HEAVENLY-B3"
    },
    {
      name: "Heavenly 02",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_04_Heavenly_02.jpg",
      sku: "HEAVENLY-02"
    },
    {
      name: "Moody 02(BR)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_05_Moody_02BR.jpg",
      sku: "MOODY-02BR"
    },
    {
      name: "Moody 02",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_06_Moody_02.jpg",
      sku: "MOODY-02"
    },
    {
      name: "Boba BL8",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_07_Boba_BL8.jpg",
      sku: "BOBA-BL8"
    },
    {
      name: "Boba 02",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section5/fall_08_Boba_02.jpg",
      sku: "BOBA-02"
    }
  ];

  const handleQuickAdd = (product) => {
    addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      thumbnail: product.image,
      stock: 15
    });
    window.dispatchEvent(new CustomEvent("openCartToast", { detail: product }));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Header isDark={true} />

      {/* =========================================================================
          HERO CAMPAIGN VIDEO SECTION (Seamless Clean Pitch Black Vintage View)
         ========================================================================= */}
      <section className="relative w-full bg-black flex flex-col justify-center items-center pt-24 pb-8 md:pb-12 px-4 md:px-8">
        
        {/* Clean Vintage 4:3 Film Reel Video (Không Viền Khung, Kích Thước Lớn & Sắc Nét 100% Theo Web Gốc) */}
        <div className="relative w-full max-w-[880px] aspect-[4/3] bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl group flex items-center justify-center">
          <video
            ref={heroVideoRef}
            src="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section1/fall2025_campaign-full-final_1pc.mp4"
            poster="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section3/doorbell-edit2.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover rounded-[32px] md:rounded-[48px]"
          />

          {/* Overlaid Minimalist Play & Mute Controls at Bottom-Right */}
          <div className="absolute bottom-5 right-6 flex items-center gap-3.5 z-20 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              aria-label={isPlayingVideo ? "Pause video" : "Play video"}
              className="text-white hover:opacity-75 transition-opacity"
            >
              {isPlayingVideo ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="text-white hover:opacity-75 transition-opacity"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CAMPAIGN GALLERY WITH 5 SWATCH THUMBNAILS (Section 2 Clean Match 100%)
         ========================================================================= */}
      <section className="w-full bg-black pb-24 px-4 md:px-8">
        <div className="max-w-[880px] mx-auto flex flex-col items-center">
          
          {/* Main Active Photo Display Frame */}
          <div className="relative w-full aspect-[4/3] rounded-[24px] md:rounded-[36px] overflow-hidden bg-neutral-950 shadow-2xl">
            <img
              src={campaignImages[activeCampaignIndex].pc}
              alt={campaignImages[activeCampaignIndex].modelName}
              onError={handleImageError}
              className="w-full h-full object-cover transition-all duration-500 rounded-[24px] md:rounded-[36px]"
            />
          </div>

          {/* 5 Small Swatch Thumbnails Row with Dynamic Model Name Under Active Thumbnail */}
          <div className="w-full grid grid-cols-5 gap-2.5 mt-5">
            {campaignImages.map((img, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <button
                  onClick={() => setActiveCampaignIndex(idx)}
                  aria-label={`Select campaign image ${idx + 1}`}
                  className={`w-full aspect-[4/3] rounded-xs overflow-hidden transition-all duration-300 ${
                    activeCampaignIndex === idx
                      ? "opacity-100 ring-1 ring-white/90"
                      : "opacity-35 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.pc}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </button>

                {/* Text aligned under active thumbnail (Giống 100% Ảnh Chụp Của Bạn) */}
                <div className="h-6 mt-2 overflow-visible">
                  {activeCampaignIndex === idx && (
                    <p className="text-[9px] md:text-[10px] tracking-wider text-neutral-400 font-sans whitespace-nowrap">
                      Hunter's wearing{" "}
                      <Link
                        to={`/shop/${img.productSku}`}
                        className="text-white underline font-medium hover:text-neutral-300 transition-colors"
                      >
                        {img.modelName}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Description Text Below Section 2 (Exact Official Text & Styling Match 100%) */}
        <div className="mt-12 text-center max-w-xl mx-auto px-4 z-10">
          <p className="text-[11px] md:text-[13px] leading-relaxed text-neutral-300 font-serif tracking-normal">
            Gentle Monster unveils its 2025 FALL Collection with “THE HUNT,” a one-minute film starring Hunter Schafer, directed by Nadia Lee Cohen. The collection introduces lighter, delicate silhouettes that redefine modern sophistication. Slimmed frames and understated details add an expression of refinement and precision, while dynamic metallic colorways form a tasteful balance to complete the collection.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: RETRO DOORBELL & AXE VIDEO ("Something's waiting behind the door... Buzz in")
         ========================================================================= */}
      <section className="w-full bg-black py-16 text-center">
        <div className="max-w-[880px] mx-auto flex flex-col items-center justify-center px-4">
          
          {/* Dynamic Doorbell / Axe Video Box (Nút chuông nhỏ gọn, video chiếc rìu bự +20%) */}
          <div 
            onClick={handleBuzzIn}
            className={`relative bg-black shadow-2xl mb-8 group cursor-pointer transition-all duration-700 ease-out overflow-hidden ${
              isBuzzed
                ? "w-full max-w-[480px] md:max-w-[580px] aspect-[9/16] md:aspect-[3/5] rounded-2xl scale-100"
                : "w-[125px] md:w-[145px] aspect-[136/279] rounded-lg hover:scale-105"
            }`}
          >
            {isBuzzed ? (
              <video
                ref={doorbellVideoRef}
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section3/story_doorbell_0_axe_video.mp4"
                autoPlay
                playsInline
                onEnded={handleDoorbellEnded}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <video
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section3/doorbell-edit2.mp4"
                poster="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section3/doorbell-edit2.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Subtitle & Interactive Link (Match Web Gốc 100%) */}
          <p className="text-[13px] md:text-[15px] font-serif text-neutral-300 tracking-wide leading-relaxed">
            Something’s waiting behind the door
          </p>
          <button
            onClick={handleBuzzIn}
            className="mt-3 text-[11px] md:text-[12px] font-serif text-white underline underline-offset-4 hover:text-neutral-300 transition-colors cursor-pointer tracking-wider"
          >
            Buzz in
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: UNCOVER 2025 FALL COLLECTION (High-Fashion Editorial Grid Match 100%)
         ========================================================================= */}
      <section className="w-full bg-black py-20">
        <div className="max-w-[720px] mx-auto px-4">
          
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-lg md:text-2xl font-serif tracking-wide text-white font-light">
              Uncover 2025 FALL Collection
            </h2>
          </div>

          {/* Row 1: 2-Column Grid (Item 1: Monica R11 & Item 2: Heavenly B3) */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 items-start mb-12">
            
            {/* Item 1: Monica R11 */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-neutral-950 shadow-2xl group">
                {detailItems[0].video ? (
                  <video
                    src={detailItems[0].video}
                    poster={detailItems[0].img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={detailItems[0].img}
                    alt={detailItems[0].modelName}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] md:text-[11px] font-sans">
                <span className="text-white font-medium">{detailItems[0].modelName}</span>
                <Link to={`/shop/${detailItems[0].sku}`} className="text-neutral-400 underline hover:text-white transition-colors">
                  Shop
                </Link>
              </div>
            </div>

            {/* Item 2: Heavenly B3 */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-neutral-950 shadow-2xl group">
                <img
                  src={detailItems[1].img}
                  alt={detailItems[1].modelName}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] md:text-[11px] font-sans">
                <span className="text-white font-medium">{detailItems[1].modelName}</span>
                <Link to={`/shop/${detailItems[1].sku}`} className="text-neutral-400 underline hover:text-white transition-colors">
                  Shop
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: 1-Column Centered Item (Item 3: Boba BL8) */}
          <div className="max-w-[360px] mx-auto flex flex-col mb-12">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-neutral-950 shadow-2xl group">
              {detailItems[2].video ? (
                <video
                  src={detailItems[2].video}
                  poster={detailItems[2].img}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={detailItems[2].img}
                  alt={detailItems[2].modelName}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] md:text-[11px] font-sans">
              <span className="text-white font-medium">{detailItems[2].modelName}</span>
              <Link to={`/shop/${detailItems[2].sku}`} className="text-neutral-400 underline hover:text-white transition-colors">
                Shop
              </Link>
            </div>
          </div>

          {/* Row 3: 2-Column Grid (Item 4: Rollie 02(BR) & Item 5: Moody 02) */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 items-start">
            
            {/* Item 4: Rollie 02(BR) */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-neutral-950 shadow-2xl group">
                <img
                  src={detailItems[3].img}
                  alt={detailItems[3].modelName}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] md:text-[11px] font-sans">
                <span className="text-white font-medium">{detailItems[3].modelName}</span>
                <Link to={`/shop/${detailItems[3].sku}`} className="text-neutral-400 underline hover:text-white transition-colors">
                  Shop
                </Link>
              </div>
            </div>

            {/* Item 5: Moody 02 */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-neutral-950 shadow-2xl group">
                <img
                  src={detailItems[4].img}
                  alt={detailItems[4].modelName}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] md:text-[11px] font-sans">
                <span className="text-white font-medium">{detailItems[4].modelName}</span>
                <Link to={`/shop/${detailItems[4].sku}`} className="text-neutral-400 underline hover:text-white transition-colors">
                  Shop
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: SHOP THE COLLECTION (Clean Match 100% Gentle Monster Official Site)
         ========================================================================= */}
      <section className="w-full bg-black py-20 text-center">
        <div className="max-w-[760px] mx-auto px-4">
          
          {/* Title */}
          <h3 className="text-sm md:text-base font-serif text-neutral-300 mb-14 tracking-wide font-light">
            Shop the Collection
          </h3>

          {/* 4-Column Grid with NO Borders / NO Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-6 mb-16">
            {shopCollectionItems.map((item, idx) => (
              <Link
                key={idx}
                to={`/shop/${item.sku}`}
                className="group flex flex-col items-start text-left"
              >
                <div className="w-full aspect-[3/4] overflow-hidden bg-[#dcdcdc] rounded-none">
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-serif text-[11px] md:text-[12px] text-neutral-300 pt-1.5 px-0.5 tracking-normal group-hover:text-white transition-colors">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Center Button */}
          <div className="mt-12">
            <Link
              to="/sunglasses"
              className="text-[12px] md:text-[13px] font-serif text-neutral-300 underline underline-offset-4 hover:text-white transition-colors tracking-wide"
            >
              Discover the Entire Collection
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTERACTIVE GAME EXPERIENCE ("THE ROOM: ESCAPE THE HUNT")
         ========================================================================= */}
      <section className="w-full bg-black py-20 text-center">
        <div className="max-w-[880px] mx-auto px-4">
          
          {/* Vertical Horror Game Poster / Video Box */}
          <div 
            onClick={() => setShowGameModal(true)}
            className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[9/16] rounded-none overflow-hidden bg-black shadow-2xl mb-10 mx-auto group cursor-pointer"
          >
            <video
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/video/section6/theroom.mp4"
              poster="https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section6/theroom_poster.png"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Horror Description Text (Match text-[#9C181A] 100%) */}
          <p className="font-serif text-[13px] md:text-[15px] text-[#9C181A] max-w-md mx-auto leading-relaxed font-light mb-8">
            Experience an interactive story game,<br className="hidden md:inline" />
            “THE ROOM.” Discover hidden clues and<br className="hidden md:inline" />
            escape the room within the time limit.
          </p>

          {/* Game Start Trigger (Không chuyển trang / No link - mở Modal Game) */}
          <div>
            <button
              onClick={() => setShowGameModal(true)}
              className="font-serif text-[13px] md:text-[15px] text-[#9C181A] underline underline-offset-4 decoration-[#9C181A] hover:opacity-80 transition-opacity tracking-wide font-light cursor-pointer"
            >
              Game Start
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          GAME MODAL
         ========================================================================= */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl max-w-lg w-full p-8 text-center relative">
            <button
              onClick={() => setShowGameModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <Sparkles className="mx-auto text-amber-400 mb-4" size={32} />
            <h3 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-2">
              THE ROOM: ESCAPE THE HUNT
            </h3>
            <p className="text-[12px] text-neutral-300 mb-6 font-light leading-relaxed">
              Find secret codes and clues hidden inside the digital room to unlock exclusive Gentle Monster rewards.
            </p>
            <button
              onClick={() => {
                alert("Game Room loading... Enjoy the experience!");
                setShowGameModal(false);
              }}
              className="w-full py-3.5 bg-white text-black font-bold text-[11px] tracking-[0.25em] uppercase rounded-lg hover:bg-neutral-200 transition-all"
            >
              ENTER DIGITAL ROOM NOW
            </button>
          </div>
        </div>
      )}

      {/* Footer nhỏ gọn tối màu đen (Match 100% Gentle Monster) */}
      <Footer darkMode={true} />
    </div>
  );
};

export default Fall2025Collection;
