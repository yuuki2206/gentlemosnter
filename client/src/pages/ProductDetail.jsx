import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import { productsData } from "../data/products";
import { CartContext } from "../context/CartContext";
import { handleImageError } from "../config/media";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowDown, Bookmark, Plus, Minus, ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);

  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState({
    shipping: false,
    details: true, // Details open by default as in original layout
    sizeFit: false,
  });

  // Size Unit toggle
  const [sizeUnit, setSizeUnit] = useState("MM"); // "MM" or "IN"

  // Hàm fetcher giả lập truy vấn bất đồng bộ một sản phẩm kèm liên kết
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let storedProducts = localStorage.getItem("gm_products_db_v3");
        if (storedProducts) {
          try {
            const parsed = JSON.parse(storedProducts);
            if (parsed.length > 0 && parsed[0].url && !parsed[0].url.startsWith("http")) {
              localStorage.removeItem("gm_products_db_v3");
              storedProducts = null;
            }
          } catch (e) {}
        }
        if (!storedProducts) {
          localStorage.setItem("gm_products_db_v3", JSON.stringify(productsData));
          storedProducts = JSON.stringify(productsData);
        }
        const allProducts = JSON.parse(storedProducts);
        const currentProduct = allProducts.find(p => p.sku === sku);
        
        if (currentProduct) {
          // Lấy các sản phẩm có cùng bộ sưu tập hoặc loại kính để làm "Similar Frames"
          const similar = allProducts
            .filter(p => p.sku !== sku && p.collection === currentProduct.collection)
            .slice(0, 6);
            
          // Lấy các màu sắc khác có cùng tên cơ bản (ví dụ: "Musubi") để làm Colorways
          // Tách từ đầu tiên của name làm keyword so khớp
          const baseName = currentProduct.name.split(" ")[0];
          const colorways = allProducts
            .filter(p => p.name.startsWith(baseName))
            .map(p => ({
              sku: p.sku,
              name: p.name,
              thumbnail: p.thumbnail,
              collection: p.collection
            }));
            
          resolve({
            ...currentProduct,
            similarFrames: similar,
            colorways: colorways
          });
        } else {
          reject(new Error("Product not found"));
        }
      }, 400); // 400ms delay
    });
  };

  const { data: product = null, isLoading: loading, error } = useSWR(
    `product-${sku}`,
    fetcher
  );

  // Sync recently viewed on product resolution
  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);

      // Lưu vào danh sách vừa xem gần đây (Recently Viewed)
      const savedStr = localStorage.getItem("recentlyViewed");
      let recentlyViewedList = [];
      if (savedStr) {
        try {
          recentlyViewedList = JSON.parse(savedStr);
        } catch (err) {
          console.error(err);
        }
      }
      recentlyViewedList = recentlyViewedList.filter((item) => item.sku !== product.sku);
      recentlyViewedList.unshift({
        sku: product.sku,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
      });
      if (recentlyViewedList.length > 5) {
        recentlyViewedList = recentlyViewedList.slice(0, 5);
      }
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedList));
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col justify-between">
        <Header forceSolid={true} />
        <div className="flex-grow flex items-center justify-center pt-[100px]">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-black animate-pulse">
            LOADING PRODUCT DETAILS...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col justify-between">
        <Header forceSolid={true} />
        <div className="flex-grow flex flex-col items-center justify-center pt-[150px] px-6 text-center">
          <p className="text-[11px] text-red-500 font-semibold tracking-wider mb-6 bg-red-50 py-2.5 px-5 border-l-2 border-red-500 uppercase">
            {error || "LỖI TẢI SẢN PHẨM."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="border border-black text-black text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-colors rounded-none hover:bg-black hover:text-white"
          >
            Quay Lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.sku === product.sku);

  // Mảng tất cả ảnh phụ
  const mediaList = [product.thumbnail, ...(product.gallery || [])].filter(
    (url, index, self) => self.indexOf(url) === index && url !== ""
  );

  const isVideoMedia = (url) => url?.toLowerCase().endsWith(".mp4");

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSwatchColorStyle = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("black") || lower.includes("dark")) return { backgroundColor: "#000000" };
    if (lower.includes("grey") || lower.includes("gray")) return { backgroundColor: "#808080" };
    if (lower.includes("white")) return { backgroundColor: "#ffffff", border: "1px solid #ddd" };
    if (lower.includes("khaki")) return { backgroundColor: "#8f9779" };
    if (lower.includes("clear") || lower.includes("transparent") || lower.includes("crystal")) {
      return { 
        background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
        border: "1px solid #cbd5e1"
      };
    }
    if (lower.includes("tortoise") || lower.includes("brown") || lower.includes("amber")) {
      return { 
        backgroundImage: "radial-gradient(circle, #5c4033 20%, #3d2314 80%)",
        border: "1px solid #3d2314"
      };
    }
    if (lower.includes("green")) return { backgroundColor: "#1e3a1e" };
    if (lower.includes("blue")) return { backgroundColor: "#1e2a3a" };
    if (lower.includes("pink")) return { backgroundColor: "#fbcfe8" };
    if (lower.includes("orange")) return { backgroundColor: "#fed7aa" };
    if (lower.includes("yellow")) return { backgroundColor: "#fef08a" };
    return { backgroundColor: "#4b5563" };
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.sku);
    } else {
      addToWishlist({
        sku: product.sku,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        slug: product.slug,
      });
    }
  };

  const handleAddToCart = () => {
    const item = {
      sku: product.sku,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      slug: product.slug,
    };
    addToCart(item);
    window.dispatchEvent(new CustomEvent("openCartToast", { detail: item }));
  };

  // Convert mm to inches
  const mmToIn = (valStr) => {
    if (!valStr) return "N/A";
    const num = parseFloat(valStr.replace("mm", ""));
    if (isNaN(num)) return valStr;
    return (num / 25.4).toFixed(1) + " in";
  };

  // Parse color swatch label (trích xuất màu từ tên sản phẩm, VD: "Vert 02(CM)" -> "Silver / Clear")
  const getSwatchColorLabel = (prodName) => {
    if (prodName.includes("(CM)")) return "Silver / Clear";
    if (prodName.includes("-Y")) return "Silver / Yellow";
    if (prodName.includes("01")) return "Black / Clear";
    if (prodName.includes("02")) return "Silver / Clear";
    return "Silver";
  };

  // Quy đổi giá trị số từ DB (USD) sang VNĐ cho chính xác giao diện hãng
  const displayPrice = product.price < 1000 
    ? Math.round(product.price * 27215.36) 
    : product.price;

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-black font-sans antialiased flex flex-col justify-between">
      <Header forceSolid={true} />

      {/* ================= THÂN TRANG CHI TIẾT SẢN PHẨM ================= */}
      <main className="flex-grow pt-[90px] pb-12 w-full max-w-full mx-auto px-4 lg:px-[60px]">
        
        {/* Nút quay lại shop */}
        <div className="py-2.5 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="text-[9px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={11} /> BACK
          </button>
        </div>
        {/* CẤU TRÚC SPLIT: TRÁI SCROLLABLE GALLERY, PHẢI STICKY SIDEBAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start w-full relative gap-12 lg:gap-16 max-w-[1440px] mx-auto">
          
          {/* CỘT TRÁI: Gallery hình ảnh/video sản phẩm */}
          <div className="w-full lg:flex-1 flex lg:flex-col overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none gap-0 scroll-smooth">
            
            {mediaList.map((mediaUrl, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 snap-start flex justify-center items-center overflow-hidden relative bg-transparent h-[320px] lg:h-auto"
                style={{ aspectRatio: index === 0 ? "1/1" : "1.6", maxHeight: "350px" }}
              >
                {isVideoMedia(mediaUrl) ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-300 scale-[0.95] lg:scale-[1.1]"
                  >
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`${product.name} detail view ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-300 scale-[0.95] lg:scale-[1.1]"
                    onError={handleImageError}
                  />
                )}
 
                {/* Biểu tượng mũi tên scroll xuống chỉ ở ảnh đầu tiên trên Desktop */}
                {index === 0 && mediaList.length > 1 && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-black/40 animate-bounce max-lg:hidden">
                    <ArrowDown size={20} strokeWidth={1} />
                  </div>
                )}
              </div>
            ))}
 
          </div>

          {/* CỘT PHẢI (350px): Sticky Sidebar ghim cố định bên phải */}
          <div className="w-full lg:w-[350px] lg:sticky lg:top-0 lg:pt-[100px] flex-shrink-0 bg-transparent space-y-6 text-left flex flex-col justify-start">
            
            {/* Header thông tin: Tên sản phẩm, giá, nút Bookmark */}
            <div className="relative pr-8 space-y-1">
              
              {/* Nút Bookmark ghim góc trên bên phải */}
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-black transition-colors"
                title={isWishlisted ? "Xóa khỏi yêu thích" : "Lưu vào yêu thích"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22" fill={isWishlisted ? "#111111" : "none"} stroke="#111111" strokeWidth="1.2">
                  <path d="M8.38236 13.9221L8 13.6059L7.61764 13.9221L0.6 19.7253V2.6H15.4V19.7253L8.38236 13.9221Z"/>
                </svg>
              </button>

              <h1 className="text-[18px] font-[350] leading-[22px] tracking-wide text-black">{product.name}</h1>
              
              <p className="font-bold text-[13px] leading-[17px] text-black mt-1">
                ₫ {Number(displayPrice).toLocaleString("en-US")} {product.price > 100 ? "" : " - To be restocked"}
              </p>

              {/* THÔNG TIN TRẠNG THÁI TỒN KHO CHO KHÁCH HÀNG */}
              {(() => {
                const charCodeSum = (product?.sku || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const defaultStock = charCodeSum % 19 === 0 ? 0 : charCodeSum % 7 === 0 ? 3 : (charCodeSum % 25) + 4;
                const productStock = product?.stock !== undefined ? Number(product.stock) : defaultStock;

                if (productStock === 0) {
                  return (
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" /> OUT OF STOCK (TẠM HẾT HÀNG)
                    </p>
                  );
                } else if (productStock <= 5) {
                  return (
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse" /> LIMITED STOCK - ONLY {productStock} LEFT IN STOCK!
                    </p>
                  );
                } else {
                  return (
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> IN STOCK ({productStock} ITEMS AVAILABLE)
                    </p>
                  );
                }
              })()}
            </div>

            {/* COLORWAYS (Swatches màu sắc hình tròn/ô vuông nhỏ 24x24px phẳng kèm thanh ngang active) */}
            {product.colorways && product.colorways.length > 0 && (
              <div className="space-y-2.5 border-t border-black/10 pt-5">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#666] font-semibold">
                  <span>Colorway Options</span>
                  <span className="text-black font-semibold">{product.colorLabel || getSwatchColorLabel(product.name)}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-3">
                  {product.colorways.map((variant) => (
                    <div key={variant.sku} className="relative group/chip flex flex-col items-center">
                      <Link
                        to={`/shop/${variant.sku}`}
                        className={`w-5 h-5 rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
                          variant.sku === product.sku 
                            ? "ring-1 ring-offset-2 ring-black" 
                            : "border border-black/10 hover:border-black"
                        }`}
                        style={getSwatchColorStyle(variant.name)}
                      >
                        {/* Tooltip nhỏ khi hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover/chip:block bg-black text-white text-[8px] tracking-wider uppercase py-1 px-2 whitespace-nowrap z-50 rounded-xs">
                          {variant.name}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nút hành động chính (Notify Me / Add To Bag) */}
            <div className="pt-2">
              {(() => {
                const charCodeSum = (product?.sku || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const defaultStock = charCodeSum % 19 === 0 ? 0 : charCodeSum % 7 === 0 ? 3 : (charCodeSum % 25) + 4;
                const productStock = product?.stock !== undefined ? Number(product.stock) : defaultStock;

                return (
                  <button
                    onClick={(e) => {
                      if (productStock === 0) {
                        alert("Sản phẩm này hiện tại đã hết hàng!");
                        return;
                      }
                      handleAddToCart(e);
                    }}
                    disabled={productStock === 0}
                    className={`w-full text-[13px] font-normal tracking-[0.2em] py-3.5 rounded-[8px] transition-colors uppercase text-center ${
                      productStock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                        : "bg-[#111111] hover:bg-neutral-800 text-white cursor-pointer"
                    }`}
                  >
                    {productStock === 0 ? "OUT OF STOCK" : product.price > 100 ? "ADD TO BAG" : "NOTIFY ME"}
                  </button>
                );
              })()}
            </div>

            {/* ACCORDION GROUP (Shipping, Details, Size & Fit) */}
            <div className="border-t border-black/10 pt-2 space-y-1">
              
              {/* Accordion 1: SHIPPING & RETURNS */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full py-4 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-black"
                >
                  <span>SHIPPING & RETURNS | IMPORT DUTY & TAX</span>
                  {openAccordion.shipping ? <Minus size={11} strokeWidth={1.5} /> : <Plus size={11} strokeWidth={1.5} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion.shipping ? "max-h-[200px] pb-4" : "max-h-0"}`}>
                  <p className="text-[9px] md:text-[10px] text-gray-500 font-light leading-relaxed">
                    Standard shipping takes 3-7 business days. Import duties, custom fees, and local taxes are fully computed and paid at checkout. Enjoy free shipping on all orders over ₫10,000,000. Returns are accepted within 7 days of receiving the item.
                  </p>
                </div>
              </div>

              {/* Accordion 2: DETAILS */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-4 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-black"
                >
                  <span>DETAILS</span>
                  {openAccordion.details ? <Minus size={11} strokeWidth={1.5} /> : <Plus size={11} strokeWidth={1.5} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion.details ? "max-h-[400px] pb-4" : "max-h-0"}`}>
                  <div className="space-y-4 text-[9px] md:text-[10px] font-light leading-relaxed text-[#555]">
                    <p className="font-semibold text-black">{product.description || "Classic silhouette highlights the unique design vision of Gentle Monster."}</p>
                    <ul className="list-disc pl-4 space-y-1.5">
                      <li>{product.collection || "Veggie"} Collection</li>
                      {product.features && product.features.length > 0 ? (
                        product.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))
                      ) : (
                        <>
                          <li>Premium Glossy Metal / Acetate Frame</li>
                          <li>UV400 Lenses block 99.9% of UV Rays</li>
                          <li>Manufacturer & Importer: IICOMBINED CO., LTD.</li>
                          <li>Country of Manufacturer: South Korea / China</li>
                        </>
                      )}
                    </ul>
                    <p className="text-gray-400 italic pt-1 text-[8px]">
                      *Not eligible for custom fitting adjustments online. Keyring promotion has ended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accordion 3: SIZE AND FIT */}
              <div className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion("sizeFit")}
                  className="w-full py-4 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-black"
                >
                  <span>SIZE AND FIT</span>
                  {openAccordion.sizeFit ? <Minus size={11} strokeWidth={1.5} /> : <Plus size={11} strokeWidth={1.5} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion.sizeFit ? "max-h-[400px] pb-4" : "max-h-0"}`}>
                  
                  {/* Unit toggler: MM / IN */}
                  <div className="flex gap-4 border-b border-black/10 pb-2 mb-4 text-[9px] font-bold tracking-widest">
                    <button
                      onClick={() => setSizeUnit("MM")}
                      className={`pb-1 ${sizeUnit === "MM" ? "text-black border-b border-black" : "text-gray-400 hover:text-black"}`}
                    >
                      MM
                    </button>
                    <button
                      onClick={() => setSizeUnit("IN")}
                      className={`pb-1 ${sizeUnit === "IN" ? "text-black border-b border-black" : "text-gray-400 hover:text-black"}`}
                    >
                      IN
                    </button>
                  </div>

                  {/* Sizing Details Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    
                    {/* Bảng thông số đo đạc hình học */}
                    <div className="space-y-2.5 text-[9px] md:text-[10px] font-light">
                      <div className="flex justify-between border-b border-black/5 pb-1.5">
                        <span className="text-gray-400 uppercase">Lens Width</span>
                        <span className="font-semibold text-black font-mono">
                          {sizeUnit === "MM" ? product.lensWidth : mmToIn(product.lensWidth)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 pb-1.5">
                        <span className="text-gray-400 uppercase">Bridge</span>
                        <span className="font-semibold text-black font-mono">
                          {sizeUnit === "MM" ? product.bridge : mmToIn(product.bridge)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 pb-1.5">
                        <span className="text-gray-400 uppercase">Frame Front</span>
                        <span className="font-semibold text-black font-mono">
                          {sizeUnit === "MM" ? product.frameFront : mmToIn(product.frameFront)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 pb-1.5">
                        <span className="text-gray-400 uppercase">Temple Length</span>
                        <span className="font-semibold text-black font-mono">
                          {sizeUnit === "MM" ? product.frameSide : mmToIn(product.frameSide)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 pb-1.5">
                        <span className="text-gray-400 uppercase">Lens Height</span>
                        <span className="font-semibold text-black font-mono">
                          {sizeUnit === "MM" ? product.lensHeight : mmToIn(product.lensHeight)}
                        </span>
                      </div>
                    </div>

                    {/* Thanh Fit indicator trượt kéo ngang phẳng */}
                    <div className="space-y-5 border-l border-black/5 pl-6 text-[8px] md:text-[9px] uppercase tracking-wider text-gray-400">
                      
                      {/* Fit Width Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-black font-semibold">
                          <span>Fit</span>
                        </div>
                        <div className="flex justify-between text-[7px] text-gray-400 font-medium">
                          <span>Narrow</span>
                          <span>Wide</span>
                        </div>
                        {/* Custom Slider Indicator bar */}
                        <div className="h-[1px] bg-black/10 relative w-full mt-2">
                          <div className="absolute h-1.5 w-1.5 rounded-full bg-black top-1/2 -translate-y-1/2 left-[50%]"></div>
                        </div>
                      </div>

                      {/* Bridge/Nose Fit Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[7px] text-gray-400 font-medium">
                          <span>Low Nose Bridge</span>
                          <span>High Nose Bridge</span>
                        </div>
                        {/* Custom Slider Indicator bar */}
                        <div className="h-[1px] bg-black/10 relative w-full mt-2">
                          <div className="absolute h-1.5 w-1.5 rounded-full bg-black top-1/2 -translate-y-1/2 left-[25%]"></div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* DẢI SẢN PHẨM TƯƠNG TỰ (Similar Frames) - Hòa nền phẳng, nằm ngoài Split container */}
        {product.similarFrames && product.similarFrames.length > 0 && (
          <div className="w-full text-left space-y-6 pb-12 border-t border-black/10 pt-12 mt-4">
            <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-black">
              SIMILAR FRAMES
            </h3>
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 overflow-x-auto sm:overflow-x-visible gap-4 lg:gap-6 pb-4 sm:pb-0 scrollbar-none">
              {product.similarFrames.slice(0, 6).map((similarItem) => (
                <Link
                  to={`/shop/${similarItem.sku}`}
                  key={similarItem.sku}
                  className="group flex flex-col bg-transparent transition-opacity hover:opacity-85 w-[140px] sm:w-auto flex-shrink-0 sm:flex-shrink"
                >
                  <div className="aspect-[4/3] w-full bg-transparent flex justify-center items-center overflow-hidden mb-3">
                    <img
                      src={similarItem.thumbnail}
                      alt={similarItem.name}
                      className="w-[90%] h-auto object-contain transition-transform duration-500 scale-[0.95] sm:scale-100 lg:scale-[1.2] group-hover:scale-[1.05] lg:group-hover:scale-[1.35]"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="flex flex-col text-left mt-2">
                    <span className="text-[9px] tracking-wider uppercase font-semibold text-black leading-tight">{similarItem.name}</span>
                    <span className="text-[9px] text-[#666] font-medium mt-0.5">₫{Number(similarItem.price < 1000 ? Math.round(similarItem.price * 27215.36) : similarItem.price).toLocaleString("en-US")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
