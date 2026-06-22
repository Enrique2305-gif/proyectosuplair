export const ROLES = {
  COMPRADOR: "comprador",
  PROVEEDOR: "proveedor",
  ADMINISTRADOR: "administrador",
};

export const ROLE_HOME = {
  [ROLES.COMPRADOR]: "/comprador",
  [ROLES.PROVEEDOR]: "/proveedor",
  [ROLES.ADMINISTRADOR]: "/administrador",
};

export const normalizeRole = (value) => {
  if (value === 1 || value === "1") return ROLES.COMPRADOR;
  if (value === 2 || value === "2") return ROLES.PROVEEDOR;
  if (value === 3 || value === "3") return ROLES.ADMINISTRADOR;

  const role = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["comprador", "cliente", "client"].includes(role)) return ROLES.COMPRADOR;
  if (["proveedor", "supplier"].includes(role)) return ROLES.PROVEEDOR;
  if (["administrador", "admin", "administrator"].includes(role)) return ROLES.ADMINISTRADOR;

  return "";
};

export const getUserRole = (user = {}) => {
  return normalizeRole(user?.Rol ?? user?.rol ?? user?.tipo ?? user?.IdRol ?? user?.idRol);
};

export const getHomeByUser = (user = {}) => ROLE_HOME[getUserRole(user)] || "/login";
