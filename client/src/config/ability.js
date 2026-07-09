import { defineAbility } from "@casl/ability";

/**
 * Định nghĩa bộ phân quyền CASL v7 (Role-based access control)
 * - role 'admin': Có quyền 'manage' - 'all' (thực hiện mọi hành động trên mọi thực thể).
 * - role 'user' hoặc khách vãng lai: Chỉ có quyền 'read' - 'Product' (không được phép Thêm/Sửa/Xóa).
 */
export const defineAbilitiesFor = (user) => {
  return defineAbility((can, cannot) => {
    if (user && user.role === "admin") {
      can("manage", "all");
    } else {
      can("read", "Product");
      cannot("manage", "Product");
      cannot("manage", "all");
    }
  });
};
