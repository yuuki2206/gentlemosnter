import { defineAbility } from "@casl/ability";

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
