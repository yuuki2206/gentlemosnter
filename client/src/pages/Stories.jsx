/**
 * Stories Component - Trang giới thiệu các chiến dịch thương hiệu (Stacked Full-bleed Rows).
 * - useState & scroll listener: Theo dõi tọa độ cuộn màn hình để tạo hiệu ứng Parallax hình nền.
 * - Responsive picture layout: Dùng thẻ <picture> tự động chuyển ảnh dọc (Mobile) và ngang (PC).
 * - Text Overlay: Đặt chữ đè góc dưới bên trái, tăng tương phản đọc chữ bằng lớp phủ gradient đen mờ.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { stories } from "../data/stories";

const Stories = () => {
  const [featuredStory, ...otherStories] = stories;

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
      {/* Header trong suốt ở đầu trang */}
      <Header forceTransparent={true} />

      {/* ================= MOBILE HEADER SPACE & TITLE ================= */}
      {/* Chỉ hiển thị trên mobile, hiển thị dưới mobile header (56px) */}
      <div className="hidden max-md:flex pt-[56px] py-[16px] px-[24px] bg-black items-baseline gap-2">
        <h1 className="text-[18px] leading-[22px] uppercase font-normal tracking-wider">
          Stories
        </h1>
        <span className="text-[18px] leading-[22px] text-gray-500 font-light">
          {stories.length}
        </span>
      </div>

      {/* ================= 1. FEATURED CAMPAIGN (LATEST STORY) ================= */}
      {featuredStory && (
        <div className="relative w-full overflow-hidden" id="storiesId0">
          <Link to={`/stories/${featuredStory.id}`} className="block relative w-full group">
            {/* Figure aspect-ratio container */}
            <figure className="w-full overflow-hidden relative max-md:h-[145.066vw] aspect-[3840/1800]">
              <picture className="w-full h-full object-cover">
                <source media="(max-width: 767px)" srcSet={featuredStory.mobileImageUrl} />
                <img
                  src={featuredStory.pcImageUrl}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  loading="eager"
                />
              </picture>
              {/* Lớp phủ chuyển màu để đọc text tốt hơn */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </figure>

            {/* Text Overlay: Bottom-Left (Khớp CSS trích xuất F12) */}
            <div className="absolute z-10 bottom-0 left-0 w-full flex flex-col gap-[8px] px-[60px] pb-[90px] max-md:px-[24px] max-md:pb-[48px] pt-[12px] max-md:gap-[10px] text-left">
              <em className="block text-[13px] text-[#fff] leading-[17px] uppercase not-italic tracking-[0.1em]">
                latest
              </em>
              <span className="block text-[18px] text-white leading-[22px] font-normal uppercase tracking-wider">
                {featuredStory.title}
              </span>
              <span className="block text-[13px] text-white leading-[17px] max-w-[515px] max-md:max-w-none font-light tracking-wide opacity-90">
                {featuredStory.description}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ================= 2. ALL STORIES SEPARATOR BAR (Khớp F12) ================= */}
      <div className="flex py-[28px] px-[60px] bg-[#fff] text-black max-md:pt-[36px] max-md:pb-[16px] max-md:px-[24px]">
        <h1 className="text-[18px] leading-[22px] max-md:text-[13px] max-md:leading-[17px] uppercase font-medium tracking-[0.1em]">
          ALL STORIES
        </h1>
      </div>

      {/* ================= 3. STACKED STORIES LIST (Khớp F12) ================= */}
      <section className="w-full flex flex-col bg-black">
        {otherStories.map((story, index) => (
          <div
            key={story.id}
            className="w-full stories-list__item mt-[2px]"
            id={`storiesId${index + 1}`}
          >
            <Link to={`/stories/${story.id}`} className="block relative w-full group">
              {/* Figure aspect-ratio container */}
              <figure className="w-full overflow-hidden relative max-md:h-[125.067vw] aspect-[3840/1800]">
                <picture className="w-full h-full object-cover">
                  <source media="(max-width: 767px)" srcSet={story.mobileImageUrl} />
                  <img
                    src={story.pcImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </picture>
                {/* Lớp phủ chuyển màu ở đáy */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </figure>

              {/* Text Overlay: Bottom-Left */}
              <div className="absolute z-10 bottom-0 left-0 w-full flex flex-col gap-[8px] px-[60px] pb-[90px] max-md:px-[24px] max-md:pb-[48px] text-left">
                <span className="block text-[18px] text-white leading-[22px] font-normal uppercase tracking-wider">
                  {story.title}
                </span>
                <span className="block text-[13px] text-[#fff] leading-[17px] font-normal tracking-[0.1em]">
                  {story.buttonText}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Stories;
