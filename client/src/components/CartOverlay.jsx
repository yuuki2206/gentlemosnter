/**
 * CartOverlay Component - Giao diện giỏ hàng và danh sách yêu thích dạng bao phủ toàn màn hình.
 * Hỗ trợ thanh toán thực tế bằng Web3 qua MetaMask, tự động sinh hóa đơn biên nhận giao dịch (Receipt Invoice)
 * và lưu trữ lịch sử đơn hàng có Tx Hash.
 */
import React, { useContext, useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, CheckCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { handleImageError } from "../config/media";

const CartOverlay = ({ isOpen, onClose, initialTab = "BAG" }) => {
  const navigate = useNavigate();
  const {
    cart,
    wishlist,
    removeFromCart,
    updateQuantity,
    removeFromWishlist,
    addToCart,
    cartTotal,
    cartCount,
    clearCart,
  } = useContext(CartContext);

  const { user, addPurchase } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Reset tab hoạt động khi mở lại overlay
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setReceiptData(null);
      setIsProcessing(false);
    }
  }, [isOpen, initialTab]);

  // Ngăn cuộn trang body phía dưới khi đang mở overlay
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // === XỬ LÝ THANH TOÁN WEB3 (METAMASK / GANACHE) ===
  const handlePayWithCrypto = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập tài khoản trước khi thực hiện thanh toán!");
      return;
    }

    if (!window.ethereum) {
      alert("Không tìm thấy ví MetaMask trên trình duyệt. Vui lòng cài đặt tiện ích MetaMask để thanh toán Web3!");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Yêu cầu MetaMask cấp quyền kết nối ví
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const senderAddress = accounts[0];

      // 2. Chuyển đổi số tiền VND sang ETH
      // Thuật toán quy đổi tỷ giá thông minh để thấy rõ biến động số dư Ganache:
      // - Nếu là sản phẩm test giá trị nhỏ (< 10,000đ): Quy đổi thành 1.5 ETH
      // - Nếu là sản phẩm kính thật (ví dụ 7.5 triệu): Quy đổi theo tỉ lệ 5,000,000đ = 1 ETH (kính 7.5tr = 1.5 ETH)
      let ethAmountVal = cartTotal / 5000000;
      if (cartTotal < 10000) {
        ethAmountVal = 1.5; // Gán 1.5 ETH để trừ tiền thấy rõ trên Ganache
      }
      const ethAmount = ethAmountVal.toFixed(4);
      
      // Chuyển đổi ETH sang đơn vị Wei dạng Hexadecimal để gửi
      const weiValue = "0x" + BigInt(Math.floor(parseFloat(ethAmount) * 1e18)).toString(16);

      // Địa chỉ ví nhận tiền của cửa hàng (Dùng ví Ganache khác của bạn làm ví nhận)
      const merchantAddress = "0x4fc3080f9B4E5dcc1f9119105e1edf2531313d97";

      // 3. Thực hiện lệnh chuyển ETH trực tiếp trên mạng Ganache qua ví MetaMask
      const txParams = {
        from: senderAddress,
        to: merchantAddress,
        value: weiValue,
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });

      // 4. Nếu giao dịch thành công (trả về txHash):
      const newInvoice = {
        id: "INV_" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString("vi-VN"),
        items: [...cart],
        total: cartTotal,
        ethTotal: ethAmount,
        txHash: txHash,
        sender: senderAddress,
        receiver: merchantAddress,
        status: "Completed",
        type: "Web3",
      };

      // Lưu đơn hàng vào lịch sử cá nhân và xóa giỏ hàng
      addPurchase(newInvoice);
      clearCart();

      // Hiển thị hóa đơn thành công
      setReceiptData(newInvoice);
      setIsProcessing(false);
    } catch (error) {
      console.error("Giao dịch Web3 lỗi:", error);
      setIsProcessing(false);
      alert("Thanh toán thất bại hoặc bạn đã từ chối ký giao dịch.");
    }
  };

  return (
    // Backdrop che toàn màn hình, nằm dưới Header (z-40) và khởi đầu từ top-[0]
    <div className="fixed inset-0 w-full h-full bg-white z-[80] overflow-y-auto pt-[80px] md:pt-[100px] text-black font-sans antialiased">
      
      {/* ================= NÚT ĐÓNG (X) GÓC PHẢI TRÊN (Khớp Mockup) ================= */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-16 text-black hover:opacity-50 transition-opacity duration-300"
        aria-label="Close Shopping Bag"
      >
        <X size={26} strokeWidth={1} />
      </button>

      {/* HIỂN THỊ TRẠNG THÁI ĐANG XỬ LÝ GIAO DỊCH METAMASK */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-6">
          <Loader className="animate-spin text-blue-600 mb-6" size={48} strokeWidth={1.5} />
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black mb-2">Web3 Transaction Processing</h2>
          <p className="text-[11px] text-gray-500 font-light leading-relaxed">
            Please approve the gas and transaction fee inside your MetaMask wallet extension popup. Waiting for confirmation...
          </p>
        </div>
      )}

      {/* HIỂN THỊ HÓA ĐƠN BIÊN NHẬN THÀNH CÔNG (RECEIPT) */}
      {!isProcessing && receiptData && (
        <div className="max-w-xl mx-auto px-6 pb-20 text-left">
          <div className="flex flex-col items-center text-center mb-8 border-b border-gray-100 pb-8">
            <CheckCircle className="text-green-500 mb-4" size={48} strokeWidth={1.5} />
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black">PAYMENT SUCCESSFUL</h2>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Receipt ID: {receiptData.id}</p>
          </div>

          <div className="space-y-6">
            {/* Chi tiết người nhận/gửi */}
            <div className="grid grid-cols-2 gap-4 text-[10px] border-b border-gray-100 pb-4">
              <div>
                <p className="font-bold text-gray-400 tracking-wider uppercase">SENDER WALLET</p>
                <p className="font-mono text-gray-600 truncate mt-1 select-all">{receiptData.sender}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400 tracking-wider uppercase">RECEIVER WALLET</p>
                <p className="font-mono text-gray-600 truncate mt-1 select-all">{receiptData.receiver}</p>
              </div>
            </div>

            {/* Chi tiết hash giao dịch blockchain */}
            <div className="text-[10px] border-b border-gray-100 pb-4">
              <p className="font-bold text-gray-400 tracking-wider uppercase">TRANSACTION HASH (TX HASH)</p>
              <p className="font-mono text-blue-700 font-semibold break-all mt-1 select-all cursor-pointer" title="Double click to copy">
                {receiptData.txHash}
              </p>
            </div>

            {/* Danh sách kính đã mua */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3">ITEMS PURCHASED</p>
              <div className="space-y-3">
                {receiptData.items.map((item) => (
                  <div key={item.sku} className="flex gap-4 items-center justify-between border-b border-gray-50 pb-2">
                    <img src={item.thumbnail} alt={item.name} className="w-12 h-9 object-contain bg-[#f4f4f4]" onError={handleImageError} />
                    <div className="flex-grow text-left">
                      <h4 className="text-[11px] font-semibold text-black">{item.name}</h4>
                      <p className="text-[9px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[11px] font-medium text-black">
                      ₫ {Number(item.price * item.quantity).toLocaleString("en-US")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">TOTAL VALUE</p>
                <p className="text-sm font-bold text-black mt-1">
                  ₫ {receiptData.total.toLocaleString("en-US")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">CRYPTO VALUE</p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {receiptData.ethTotal} ETH
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  onClose();
                  navigate("/account");
                }}
                className="w-full py-4 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
              >
                GO TO MY ACCOUNT
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 border border-gray-300 text-black text-[11px] font-bold tracking-[0.2em] uppercase hover:border-black transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HIỂN THỊ GIAO DIỆN TABS GIỎ HÀNG THƯỜNG */}
      {!isProcessing && !receiptData && (
        <>
          {/* ================= TABS DIỀU HƯỚNG TẬP TRUNG GIỮA (Khớp Mockup) ================= */}
          <div className="flex justify-center items-center gap-6 border-b border-gray-100 pb-6 mb-12">
            <button
              onClick={() => setActiveTab("BAG")}
              className={`text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === "BAG"
                  ? "border border-gray-200 bg-[#f3f3f3] text-black rounded-full px-5 py-1.5"
                  : "text-gray-400 hover:text-black px-5 py-1.5"
              }`}
            >
              BAG<sup className="ml-[2px] text-[8px]">{cartCount}</sup>
            </button>
            <button
              onClick={() => setActiveTab("WISHLIST")}
              className={`text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === "WISHLIST"
                  ? "border border-gray-200 bg-[#f3f3f3] text-black rounded-full px-5 py-1.5"
                  : "text-gray-400 hover:text-black px-5 py-1.5"
              }`}
            >
              WISHLIST<sup className="ml-[2px] text-[8px]">{wishlist.length}</sup>
            </button>
          </div>

          {/* ================= NỘI DUNG TỪNG TAB ================= */}
          <div className="w-full max-w-4xl mx-auto px-6 pb-20">
            
            {/* ================= TAB 1: SHOPPING BAG ================= */}
            {activeTab === "BAG" && (
              <div>
                {cart.length === 0 ? (
                  // Empty State (Khớp Mockup)
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-xs md:text-sm text-gray-500 font-light tracking-wide mb-8">
                      There's nothing in your Shopping Bag, yet.
                    </p>
                    <button
                      onClick={onClose}
                      className="w-full max-w-[280px] py-4 border border-black text-[11px] font-bold tracking-[0.2em] uppercase bg-transparent hover:bg-black hover:text-white transition-all duration-300"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                ) : (
                  // Active State: Danh sách sản phẩm trong giỏ hàng
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col border-t border-gray-100">
                      {cart.map((item) => (
                        <div
                          key={item.sku}
                          className="flex gap-6 py-6 border-b border-gray-100 items-center justify-between"
                        >
                          {/* Ảnh kính */}
                          <div className="w-32 aspect-[4/3] bg-[#f4f4f4] flex justify-center items-center flex-shrink-0">
                            {item.thumbnail.endsWith(".mp4") ? (
                              <video
                                src={item.thumbnail}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={handleImageError}
                              />
                            )}
                          </div>

                          {/* Thông tin chi tiết */}
                          <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="text-left">
                              <h3 className="text-sm font-semibold tracking-wider text-black">
                                {item.name}
                              </h3>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                                SKU: {item.sku}
                              </p>
                              <p className="text-xs text-gray-700 mt-2 font-medium">
                                ₫ {Number(item.price).toLocaleString("en-US")}
                              </p>
                            </div>

                            {/* Bộ đếm số lượng */}
                            <div className="flex items-center border border-gray-200 w-fit rounded-none">
                              <button
                                onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                                className="px-3 py-1 text-gray-500 hover:text-black transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-xs text-black font-medium min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                className="px-3 py-1 text-gray-500 hover:text-black transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Nút xóa */}
                          <button
                            onClick={() => removeFromCart(item.sku)}
                            className="text-gray-400 hover:text-black p-2 transition-colors duration-300"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Phần tổng thanh toán & Nút Checkout */}
                    <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="text-left">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                          SUBTOTAL
                        </span>
                        <h2 className="text-xl font-bold text-black mt-1">
                          ₫ {cartTotal.toLocaleString("en-US")}
                        </h2>
                      </div>

                      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        {/* Nút thanh toán thẻ truyền thống */}
                        <button
                          onClick={() => alert("Chuyển hướng đến cổng thanh toán Visa/Mastercard (Web2)...")}
                          className="w-full sm:w-[220px] py-4 border border-black text-[11px] font-bold tracking-[0.2em] uppercase bg-black text-white hover:bg-transparent hover:text-black transition-all duration-300"
                        >
                          PROCEED TO CHECKOUT
                        </button>
                        {/* Nút Web3 Pay With Crypto - Sẵn sàng cho Dapp */}
                        <button
                          onClick={handlePayWithCrypto}
                          className="w-full sm:w-[220px] py-4 border border-blue-600 bg-blue-600 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-blue-600 transition-all duration-300"
                        >
                          PAY WITH CRYPTO
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 2: WISHLIST ================= */}
            {activeTab === "WISHLIST" && (
              <div>
                {wishlist.length === 0 ? (
                  // Empty Wishlist State
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-xs md:text-sm text-gray-500 font-light tracking-wide mb-8">
                      Your Wishlist is empty.
                    </p>
                    <button
                      onClick={onClose}
                      className="w-full max-w-[280px] py-4 border border-black text-[11px] font-bold tracking-[0.2em] uppercase bg-transparent hover:bg-black hover:text-white transition-all duration-300"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                ) : (
                  // Active State: Danh sách yêu thích
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.sku}
                        className="flex gap-4 border-b border-gray-100 pb-6 items-center justify-between"
                      >
                        {/* Ảnh gọng */}
                        <div className="w-24 aspect-[4/3] bg-[#f4f4f4] flex justify-center items-center flex-shrink-0">
                          {item.thumbnail.endsWith(".mp4") ? (
                            <video src={item.thumbnail} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                          ) : (
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain" onError={handleImageError} />
                          )}
                        </div>

                        {/* Tên & giá */}
                        <div className="flex-1 text-left min-w-0">
                          <h4 className="text-xs font-semibold tracking-wider text-black truncate">
                            {item.name}
                          </h4>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                            SKU: {item.sku}
                          </p>
                          <p className="text-xs text-gray-700 mt-2 font-medium">
                            ₫ {Number(item.price).toLocaleString("en-US")}
                          </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(item.sku);
                            }}
                            className="px-4 py-2 bg-black text-white text-[9px] font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors"
                          >
                            ADD TO BAG
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.sku)}
                            className="text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </>
      )}

    </div>
  );
};

export default CartOverlay;
