import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL, getAuthHeaders } from "../config/api";
import { SlidersHorizontal, Plus, Edit2, Trash2, Shield, Eye, Package, UserCheck, History } from "lucide-react";
import Header from "../components/Header";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, users, ability, adminDeleteUser } = useContext(AuthContext);

  // States quản lý tabs trong Dashboard
  const [activeTab, setActiveTab] = useState("products"); // 'products' hoặc 'users'

  // States chứa danh sách sản phẩm tải từ server
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // States quản lý đơn hàng/giao dịch
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // States quản lý Form Thêm/Sửa sản phẩm
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // States cho các trường dữ liệu của Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Sunglasses");
  const [thumbnail, setThumbnail] = useState("");
  const [galleryInput, setGalleryInput] = useState(""); // Chuỗi phân tách bằng dấu phẩy
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  
  const [colorLabel, setColorLabel] = useState("");
  
  // Chi tiết sản phẩm bổ sung
  const [description, setDescription] = useState("");
  const [featuresInput, setFeaturesInput] = useState(""); // Chuỗi phân tách bằng dấu phẩy
  const [frameFront, setFrameFront] = useState("145mm");
  const [frameSide, setFrameSide] = useState("150mm");
  const [lensWidth, setLensWidth] = useState("48mm");
  const [lensHeight, setLensHeight] = useState("42mm");
  const [bridge, setBridge] = useState("20mm");

  // Bảo vệ Router: Nếu không phải Admin, tự động chuyển về trang chủ
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Tải danh sách sản phẩm từ Backend để hiển thị
  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Tải danh sách tất cả đơn hàng từ Backend để hiển thị
  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAllProducts();
      fetchAllOrders();
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  // Mở Form thêm mới sản phẩm
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setName("");
    setPrice("");
    setSku("");
    setCategory("Sunglasses");
    setThumbnail("");
    setGalleryInput("");
    setSlug("");
    setUrl("");
    setDescription("");
    setColorLabel("");
    setFeaturesInput("100% UV Protection, Zeiss Lenses, Premium Handcrafted Acetate, Comes in official packaging");
    setFrameFront("145mm");
    setFrameSide("150mm");
    setLensWidth("48mm");
    setLensHeight("42mm");
    setBridge("20mm");
    setError("");
    setSuccess("");
    setShowFormModal(true);
  };

  // Mở Form chỉnh sửa sản phẩm đã có
  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setName(product.name || "");
    setPrice(product.price || "");
    setSku(product.sku || "");
    setCategory(product.collection || "Sunglasses");
    setThumbnail(product.thumbnail || "");
    setGalleryInput(product.gallery ? product.gallery.join(", ") : "");
    setSlug(product.slug || "");
    setUrl(product.url || "");
    setDescription(product.description || "");
    setColorLabel(product.colorLabel || "");
    setFeaturesInput(product.features ? product.features.join(", ") : "");
    setFrameFront(product.frameFront || "145mm");
    setFrameSide(product.frameSide || "150mm");
    setLensWidth(product.lensWidth || "48mm");
    setLensHeight(product.lensHeight || "42mm");
    setBridge(product.bridge || "20mm");
    setError("");
    setSuccess("");
    setShowFormModal(true);
  };

  // Xử lý gửi Form (Thêm hoặc Sửa)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !sku || !thumbnail) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc (*).");
      return;
    }

    const gallery = galleryInput
      ? galleryInput.split(",").map((s) => s.trim()).filter((s) => s !== "")
      : [];

    const features = featuresInput
      ? featuresInput.split(",").map((s) => s.trim()).filter((s) => s !== "")
      : [];

    const productPayload = {
      name,
      price: Number(price),
      sku,
      collection: category,
      collections: [category],
      thumbnail,
      gallery,
      slug: slug || name.toLowerCase().replace(/ /g, "-"),
      url: url || `/shop/${sku}`,
      description,
      features,
      frameFront,
      frameSide,
      lensWidth,
      lensHeight,
      bridge,
      colorLabel,
    };

    try {
      let res;
      if (isEditing) {
        // Gọi API cập nhật
        res = await fetch(`${API_BASE_URL}/products/${sku}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(productPayload),
        });
      } else {
        // Gọi API thêm mới
        res = await fetch(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(productPayload),
        });
      }

      const responseData = await res.json();

      if (res.ok) {
        setSuccess(isEditing ? "Đã cập nhật thông tin kính thành công!" : "Đã thêm kính mới thành công!");
        setShowFormModal(false);
        fetchAllProducts(); // Tải lại danh sách
      } else {
        setError(responseData.message || "Lỗi xử lý yêu cầu.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ API.");
    }
  };

  // Xóa sản phẩm khỏi database
  const handleDeleteProduct = async (productSku) => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn xóa kính có mã SKU: ${productSku} khỏi Database?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/products/${productSku}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        alert("Đã xóa sản phẩm thành công!");
        fetchAllProducts();
      } else {
        const errData = await res.json();
        alert(errData.message || "Xóa sản phẩm thất bại.");
      }
    } catch (err) {
      alert("Kết nối server thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased flex flex-col justify-between">
      {/* Khóa Header cứng */}
      <Header forceSolid={true} />

      {/* ================= THÂN TRANG ADMIN DASHBOARD ================= */}
      <main className="flex-grow pt-[120px] pb-24 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* THANH SIDEBAR PHÂN LOẠI ADMIN */}
        <div className="w-full md:w-[240px] flex-shrink-0 text-left border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8">
          <div className="mb-8 flex items-center gap-2">
            <Shield size={18} className="text-black" />
            <h1 className="text-[12px] font-bold tracking-[0.25em] uppercase text-black">
              ADMIN PANEL
            </h1>
          </div>

          <div className="flex flex-row md:flex-col gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-left text-[11px] font-semibold tracking-wider uppercase py-3 px-4 transition-colors rounded-none flex items-center gap-3 ${
                activeTab === "products" ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
              }`}
            >
              <Package size={14} />
              Sản Phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left text-[11px] font-semibold tracking-wider uppercase py-3 px-4 transition-colors rounded-none flex items-center gap-3 ${
                activeTab === "users" ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
              }`}
            >
              <UserCheck size={14} />
              Người Dùng ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`w-full text-left text-[11px] font-semibold tracking-wider uppercase py-3 px-4 transition-colors rounded-none flex items-center gap-3 ${
                activeTab === "transactions" ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
              }`}
            >
              <History size={14} />
              Giao Dịch ({orders.length})
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 hidden md:block">
            <button
              onClick={() => navigate("/")}
              className="w-full text-center border border-black hover:bg-black hover:text-white text-black text-[10px] font-bold tracking-widest uppercase py-3 transition-colors rounded-none"
            >
              Xem Cửa Hàng (Store)
            </button>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH QUẢN LÝ DỰA TRÊN TAB ACTIVE */}
        <div className="flex-grow">
          
          {/* TAB 1: QUẢN LÝ SẢN PHẨM */}
          {activeTab === "products" && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-black">
                  DANH SÁCH SẢN PHẨM KÍNH
                </h2>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 transition-colors rounded-none flex items-center gap-2"
                >
                  <Plus size={14} /> Thêm Kính Mới
                </button>
              </div>

              {loadingProducts ? (
                <p className="text-[11px] text-gray-400 italic">Đang tải danh sách từ cơ sở dữ liệu cloud...</p>
              ) : products.length === 0 ? (
                <p className="text-[11px] text-gray-400">Không có sản phẩm nào trong database.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-100">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="px-6 py-4 text-center">Ảnh</th>
                        <th className="px-6 py-4">Mã SKU</th>
                        <th className="px-6 py-4">Tên Sản Phẩm</th>
                        <th className="px-6 py-4">Giá thành</th>
                        <th className="px-6 py-4">Loại Kính</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-[#fefefe]">
                      {products.map((item) => (
                        <tr key={item.sku} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3 text-center">
                            <img src={item.thumbnail} alt={item.name} className="w-12 h-9 object-contain bg-[#f9f9f9] mx-auto border border-gray-100" />
                          </td>
                          <td className="px-6 py-4 font-mono font-semibold text-gray-500">{item.sku}</td>
                          <td className="px-6 py-4 font-semibold text-black">{item.name}</td>
                          <td className="px-6 py-4 font-semibold text-black">
                            ₫ {Number(item.price).toLocaleString("en-US")}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{item.collection}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="text-gray-400 hover:text-black transition-colors"
                                title="Sửa thông tin"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item.sku)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG & IP */}
          {activeTab === "users" && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-black">
                  DANH SÁCH TÀI KHOẢN HỆ THỐNG
                </h2>
              </div>

              <div className="overflow-x-auto border border-gray-100">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="px-6 py-4">Họ và Tên</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Vai Trò (Role)</th>
                      <th className="px-6 py-4">IP Đăng Ký</th>
                      <th className="px-6 py-4">Ganache Wallet Address</th>
                      <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-[#fefefe]">
                    {users.map((u) => (
                      <tr key={u.email} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-black">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            u.role === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500 font-semibold">{u.registrationIp || "127.0.0.1"}</td>
                        <td className="px-6 py-4">
                          {u.walletAddress ? (
                            <span className="font-mono text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] break-all select-all font-semibold">
                              {u.walletAddress}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">No wallet address</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.email !== user.email && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${u.email}?`)) {
                                  adminDeleteUser(u.email);
                                  alert("Đã xóa tài khoản khỏi hệ thống.");
                                }
                              }}
                              className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ GIAO DỊCH & ĐƠN HÀNG */}
          {activeTab === "transactions" && (
            <div className="space-y-6 text-left">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-black">
                  LỊCH SỬ GIAO DỊCH & ĐƠN HÀNG CLOUD
                </h2>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1">
                  {orders.length} Đơn hàng
                </span>
              </div>

              {/* Thống kê Widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gray-100 p-4 bg-gray-50/50">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Doanh thu VND (Tổng)</span>
                  <span className="block text-[15px] font-bold text-black mt-1">₫ {orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString("en-US")}</span>
                </div>
                <div className="border border-gray-100 p-4 bg-gray-50/50">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Doanh thu ETH (Web3)</span>
                  <span className="block text-[15px] font-bold text-blue-700 mt-1">{orders.reduce((acc, curr) => acc + (curr.ethTotal || 0), 0).toFixed(4)} ETH</span>
                </div>
                <div className="border border-gray-100 p-4 bg-gray-50/50">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Giao dịch Web3 (MetaMask)</span>
                  <span className="block text-[15px] font-bold text-black mt-1">{orders.filter(o => o.type === "Web3").length} Đơn</span>
                </div>
                <div className="border border-gray-100 p-4 bg-gray-50/50">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Giao dịch Web2 (COD/Bank)</span>
                  <span className="block text-[15px] font-bold text-black mt-1">{orders.filter(o => o.type === "Web2").length} Đơn</span>
                </div>
              </div>

              {loadingOrders ? (
                <p className="text-[11px] text-gray-400 italic">Đang tải lịch sử giao dịch...</p>
              ) : orders.length === 0 ? (
                <p className="text-[11px] text-gray-400">Không có dữ liệu giao dịch nào.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-100">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="px-6 py-4">Mã Đơn / Ngày đặt</th>
                        <th className="px-6 py-4">Khách hàng</th>
                        <th className="px-6 py-4">Sản Phẩm</th>
                        <th className="px-6 py-4">Tổng tiền (VND)</th>
                        <th className="px-6 py-4">MetaMask Info</th>
                        <th className="px-6 py-4 text-center">Loại đơn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-[#fefefe]">
                      {orders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 space-y-1">
                            <span className="font-mono font-bold text-black block">{o.orderId}</span>
                            <span className="text-[9px] text-gray-400 block">{new Date(o.createdAt).toLocaleString("vi-VN")}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-black">
                            {o.userEmail}
                          </td>
                          <td className="px-6 py-4 space-y-1.5">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img src={item.thumbnail} alt={item.name} className="w-8 h-6 object-contain bg-[#f9f9f9] border border-gray-100" />
                                <div>
                                  <span className="font-semibold text-black block leading-none">{item.name}</span>
                                  <span className="text-[9px] text-gray-500">{item.sku} x {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </td>
                          <td className="px-6 py-4 font-bold text-black">
                            ₫ {Number(o.total).toLocaleString("en-US")}
                            {o.ethTotal > 0 && (
                              <span className="block text-[9px] text-blue-700 font-medium">{o.ethTotal.toFixed(4)} ETH</span>
                            )}
                          </td>
                          <td className="px-6 py-4 space-y-1 max-w-[200px]">
                            {o.txHash ? (
                              <div className="space-y-0.5">
                                <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Tx Hash:</span>
                                <a 
                                  href={`https://sepolia.etherscan.io/tx/${o.txHash}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="font-mono text-blue-600 hover:underline text-[9px] break-all block"
                                >
                                  {o.txHash}
                                </a>
                                <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-1">Sender Address:</span>
                                <span className="font-mono text-[9px] text-gray-500 break-all block">{o.sender}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">N/A (Web2 Transaction)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                              o.type === "Web3" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}>
                              {o.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ================= FORM MODAL THÊM / SỬA KÍNH (Popup) ================= */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[650px] border border-gray-100 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
              <h3 className="text-[12px] font-bold tracking-widest uppercase text-black">
                {isEditing ? `CHỈNH SỬA SẢN PHẨM: ${sku}` : "THÊM SẢN PHẨM KÍNH MỚI"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-black font-semibold uppercase text-[10px] tracking-wider"
              >
                Đóng (X)
              </button>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-medium tracking-wide mb-4 bg-red-50 py-2 px-3 text-left border-l-2 border-red-500">
                {error}
              </p>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Mã SKU*
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    disabled={isEditing}
                    placeholder="Ví dụ: GM-VERT-02"
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Tên Sản Phẩm*
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Vert 02"
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Giá bán (VNĐ)*
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ví dụ: 7800000"
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Phân Loại Kính*
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="Sunglasses">Sunglasses (Kính râm)</option>
                    <option value="Glasses">Glasses (Kính thường)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Nhãn Màu Sắc (Colorway Label)
                  </label>
                  <input
                    type="text"
                    value={colorLabel}
                    onChange={(e) => setColorLabel(e.target.value)}
                    placeholder="Ví dụ: Silver / Yellow, Black / Clear..."
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Mô tả chi tiết & Đặc điểm */}
              <div>
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                  Mô Tả Chi Tiết Sản Phẩm
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập đoạn giới thiệu thiết kế, chất liệu khung kính..."
                  rows={2}
                  className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                  Đặc Điểm Nổi Bật (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Ví dụ: Chống UV 100%, Tròng kính Zeiss, Gọng Acetate cao cấp..."
                  className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Thông số kích thước chi tiết */}
              <div className="border border-gray-100 p-4 space-y-3 bg-gray-50/50">
                <span className="block text-[9px] font-bold text-black uppercase tracking-wider">Thông Số Kỹ Thuật (Size)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Khung Trước</label>
                    <input
                      type="text"
                      value={frameFront}
                      onChange={(e) => setFrameFront(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Càng Kính</label>
                    <input
                      type="text"
                      value={frameSide}
                      onChange={(e) => setFrameSide(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Cầu Kính</label>
                    <input
                      type="text"
                      value={bridge}
                      onChange={(e) => setBridge(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Rộng Tròng</label>
                    <input
                      type="text"
                      value={lensWidth}
                      onChange={(e) => setLensWidth(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">Cao Tròng</label>
                    <input
                      type="text"
                      value={lensHeight}
                      onChange={(e) => setLensHeight(e.target.value)}
                      className="w-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                  Ảnh Đại Diện (Thumbnail URL)*
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="Nhập link ảnh https://"
                  className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                  Ảnh Góc Chụp Phụ (Gallery URLs - Phân cách bằng dấu phẩy)
                </label>
                <textarea
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  placeholder="Link1, Link2, Link3..."
                  rows={2}
                  className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Đường dẫn phụ (Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Mặc định tự sinh từ tên kính"
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                    Custom Route URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Mặc định: /shop/:sku"
                    className="w-full border border-gray-200 bg-white px-3 py-2.5 text-[11px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white text-[11px] font-bold tracking-widest uppercase py-3.5 mt-4 transition-colors rounded-none"
              >
                {isEditing ? "LƯU THAY ĐỔI" : "TẠO SẢN PHẨM"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6 md:px-12 flex justify-between items-center text-[10px] text-gray-400 tracking-wider uppercase font-light w-full">
        <span>© 2026 GENTLE MONSTER - ADMIN AREA</span>
        <span>SECURITY LEVEL: ROLE-BASED CASLv7</span>
      </footer>
    </div>
  );
};

export default AdminDashboard;
