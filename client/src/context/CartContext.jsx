/**
 * CartContext - Quản lý trạng thái Giỏ hàng (Cart) và Yêu thích (Wishlist).
 * - Sử dụng localStorage để lưu trữ và duy trì dữ liệu khi F5 tải lại trang.
 * - Cung cấp các hàm thêm, xóa, cập nhật số lượng sản phẩm.
 */
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // === KHỞI TẠO TRẠNG THÁI TỪ LOCALSTORAGE ===
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("gm_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("gm_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // === ĐỒNG BỘ DỮ LIỆU VỚI LOCALSTORAGE ===
  useEffect(() => {
    localStorage.setItem("gm_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("gm_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // === CÁC HÀM HÀNH ĐỘNG TRÊN GIỎ HÀNG ===
  
  // Thêm sản phẩm vào giỏ
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.sku === item.sku);
      if (existingItem) {
        // Nếu đã có trong giỏ, tăng số lượng thêm 1
        return prevCart.map((i) =>
          i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Nếu chưa có, thêm mới với số lượng là 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (sku) => {
    setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));
  };

  // Cập nhật số lượng sản phẩm trực tiếp
  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  // Xóa sạch giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  // === CÁC HÀM HÀNH ĐỘNG TRÊN DANH SÁCH YÊU THÍCH ===
  
  // Thêm vào danh sách yêu thích
  const addToWishlist = (item) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((i) => i.sku === item.sku);
      if (exists) return prevWishlist; // Đã có thì giữ nguyên
      return [...prevWishlist, item];
    });
  };

  // Xóa khỏi danh sách yêu thích
  const removeFromWishlist = (sku) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.sku !== sku));
  };

  // === CÁC GIÁ TRỊ TÍNH TOÁN ĐỘNG ===
  
  // Tổng số tiền trong giỏ
  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // Tổng số lượng sản phẩm trong giỏ
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
