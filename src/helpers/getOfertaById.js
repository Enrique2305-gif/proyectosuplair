import { apiUrl } from "../apiUrl";
import { listaOfertas, notificaciones, ofertaComprador, productos, tipoNotificacion, usuariosRegistrados } from "../data";
//import { useFetch } from "../hooks";

export const getOfertaById = (id) => {
  return listaOfertas.find(oferta => oferta.idOferta === id);
}

export const getProductoById = (id) => {
  return productos.find(prod => prod.idProducto === id);
}

export const getOfertasIndividualesByCompradorId = (id) => {
  return ofertaComprador.filter(ofertaComp => ofertaComp.idComprador === id);
}

export const getOfertaByNombreProducto = (nombre) => {
  const listaProducts = productos.filter(prod => prod.nombre.toLowerCase().includes(nombre));
  let ofertas = [];
  listaProducts.forEach(prod => {
    let res = listaOfertas.filter(oferta => oferta.idProducto === prod.idProducto);
    res.forEach(p => ofertas.push(p));
  });
  return ofertas;
}

export const getOfertaByCategoriaProducto = (categoria) => {
  //seria similar a getOfertaByNombreProducto
  const listaProducts = productos.filter(prod => prod.categoria.toLowerCase().includes(categoria));
  let ofertas = [];
  listaProducts.forEach(prod => {
    let res = listaOfertas.filter(oferta => oferta.idProducto === prod.idProducto);
    res.forEach(p => ofertas.push(p));
  });
  return ofertas;
}

export const GetCategoriaById = async (id) => {
  const response = await fetch(`${apiUrl}/catProductos?id=${id}`);
  const data = await response.json();
  const categoria = data.rows && data.rows[0];
  return categoria ? categoria.Nombre : null;
};


export const getNotificacionesByUsuarioId = (id) => {
  return notificaciones.filter(notif => notif.idUsuario === id);
}

export const getNotificacionByTipoId = (tipoId) => {
  return tipoNotificacion.find(tipo => tipo.id === tipoId);
}

export const getProveedorById = (id) => {
  return usuariosRegistrados.find(usuario => usuario.id === id);
}

export const getOfertaByIdProveedor = (id) => {
  return listaOfertas.filter(oferta => oferta.idProveedor === id);
}

export const getOfertaActivaByIdProveedor = (id) => {
  const listaOfertasByProd = listaOfertas.filter(oferta => oferta.idProveedor === id);
  return listaOfertasByProd.filter(oferta => oferta.estado === "En Curso");
}

export const getProductosByIdProveedor = (id) => {
  return productos.filter(prod => prod.nombreProveedor === "Agrícola S.A.");
}

// export const GetProvFavoritosByIdComprador = (id) => {
//   const {data, Loading} = useFetch(`${apiUrl}/catProductos?id=${id}`);
// }

// export const GetProvByIdProveedor = (id) => {
//   const {data, Loading} = useFetch(`${apiUrl}/proveedores?id=${id}`);
//   const {rows: proveedor} = !!data && data;
//   while(Loading){
//     console.log("cargando")
//   }
//   return proveedor;
// }

