import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { CartContext } from "../context/CartContext";

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const inputRef = useRef(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(CartContext);

  const getDisplayPrice = (price) => {
    return price < 1000 
      ? Math.round(price * 27215.36) 
      : price;
  };

  // Load recently viewed on open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("recentlyViewed");
      if (saved) {
        try {
          setRecentlyViewed(JSON.parse(saved));
        } catch (err) {
          console.error(err);
        }
      }
      // Autofocus input
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle typing search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Toggle wishlist handler
  const handleWishlistClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isWishlisted = wishlist.some((w) => w.sku === item.sku);
    if (isWishlisted) {
      removeFromWishlist(item.sku);
    } else {
      addToWishlist({
        sku: item.sku,
        name: item.name,
        price: item.price,
        thumbnail: item.thumbnail,
      });
    }
  };

  // Clear recently viewed
  const handleClearRecentlyViewed = () => {
    localStorage.removeItem("recentlyViewed");
    setRecentlyViewed([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#f8f8f8] z-[99999] overflow-y-auto px-4 md:px-[60px] py-[60px] text-left">
      
      {/* Header nút Close đóng */}
      <button 
        onClick={onClose}
        className="absolute top-[40px] right-[40px] p-2 hover:opacity-75 transition-opacity text-black"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Form Input tìm kiếm chính */}
      <div className="max-w-[1200px] mx-auto mt-[20px] md:mt-[40px] border-b border-black pb-3 flex items-center gap-4">
        <Search size={22} className="text-[#333]" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Please enter the search term(s)"
          className="w-full bg-transparent text-[16px] md:text-[20px] font-light placeholder-gray-400 focus:outline-none text-black"
        />
      </div>

      {/* Container Nội dung hiển thị */}
      <div className="max-w-[1200px] mx-auto mt-12 space-y-12">
        {query.trim() === "" ? (
          /* KHI CHƯA NHẬP TỪ KHÓA: Chỉ hiển thị RECENTLY VIEWED (Bỏ hoàn toàn Search Trends) */
          recentlyViewed.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                  Recently Viewed
                </h3>
                <button 
                  onClick={handleClearRecentlyViewed}
                  className="text-[9px] font-bold uppercase tracking-widest text-[#666] hover:text-black transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {recentlyViewed.map((item) => {
                  const isWishlisted = wishlist.some((w) => w.sku === item.sku);
                  return (
                    <div key={item.sku} className="group relative flex flex-col justify-between">
                      {/* Khu vực ảnh */}
                      <Link 
                        to={`/shop/${item.sku}`}
                        onClick={onClose}
                        className="block aspect-[4/3] bg-white border border-gray-100 flex items-center justify-center p-4 overflow-hidden"
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {/* Khu vực thông tin & Bookmark */}
                      <div className="mt-4 flex justify-between items-start">
                        <div className="space-y-1">
                          <Link 
                            to={`/shop/${item.sku}`} 
                            onClick={onClose}
                            className="block text-[11px] font-light tracking-wide text-black uppercase hover:underline"
                          >
                            {item.name}
                          </Link>
                          <span className="block text-[10px] text-gray-500">
                            {item.price > 100 ? `₫ ${Number(getDisplayPrice(item.price)).toLocaleString("en-US")}` : "Sold out"}
                            {item.price > 100 && item.price < 1000 && " - To be restocked"}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleWishlistClick(e, item)}
                          className="p-1 hover:opacity-75 transition-opacity text-black"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="13" 
                            height="17" 
                            viewBox="0 0 16 22" 
                            fill={isWishlisted ? "#111111" : "none"} 
                            stroke="#111111" 
                            strokeWidth={1.2}
                          >
                            <path d="M8.38236 13.9221L8 13.6059L7.61764 13.9221L0.6 19.7253V2.6H15.4V19.7253L8.38236 13.9221Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          /* KHI ĐANG NHẬP TỪ KHÓA: Hiển thị Kết quả tìm kiếm theo keyword */
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                Search Results
              </h3>
              <span className="text-[10px] font-bold text-black uppercase">
                {results.length} results
              </span>
            </div>

            {loading ? (
              <p className="text-[11px] text-gray-400 italic">Searching...</p>
            ) : results.length === 0 ? (
              <p className="text-[11px] text-gray-500 font-light">
                No results found for <span className="font-semibold">"{query}"</span>. Please try another keyword.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {results.map((item) => {
                  const isWishlisted = wishlist.some((w) => w.sku === item.sku);
                  return (
                    <div key={item.sku} className="group relative flex flex-col justify-between">
                      {/* Khu vực ảnh */}
                      <Link 
                        to={`/shop/${item.sku}`} 
                        onClick={onClose}
                        className="block aspect-[4/3] bg-white border border-gray-100 flex items-center justify-center p-4 overflow-hidden"
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {/* Khu vực thông tin & Bookmark */}
                      <div className="mt-4 flex justify-between items-start">
                        <div className="space-y-1">
                          <Link 
                            to={`/shop/${item.sku}`} 
                            onClick={onClose}
                            className="block text-[11px] font-light tracking-wide text-black uppercase hover:underline"
                          >
                            {item.name}
                          </Link>
                          <span className="block text-[10px] text-gray-500">
                            {item.price > 100 ? `₫ ${Number(getDisplayPrice(item.price)).toLocaleString("en-US")}` : "Sold out"}
                            {item.price > 100 && item.price < 1000 && " - To be restocked"}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleWishlistClick(e, item)}
                          className="p-1 hover:opacity-75 transition-opacity text-black"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="13" 
                            height="17" 
                            viewBox="0 0 16 22" 
                            fill={isWishlisted ? "#111111" : "none"} 
                            stroke="#111111" 
                            strokeWidth={1.2}
                          >
                            <path d="M8.38236 13.9221L8 13.6059L7.61764 13.9221L0.6 19.7253V2.6H15.4V19.7253L8.38236 13.9221Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDrawer;
