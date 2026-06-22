import { usuariosRegistrados } from "../../data/usuarios";

export const validarLoginCompradorById = (id) => {
  return !!usuariosRegistrados.find(user => (user.id === id && user.tipo === "comprador"));
}

export const validarLoginProveedorById = (id) => {
  return !!usuariosRegistrados.find(user => user.id === id && user.tipo === "proveedor");
}

export const validarLoginAdministradorById = (id) => {
  return !!usuariosRegistrados.find(user => user.id === id && user.tipo === "administrador");
}