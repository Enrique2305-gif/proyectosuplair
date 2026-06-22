import React from "react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { apiUrl } from "../../apiUrl";

export const ContOfeSimListaItem = ({ofertaActiva: oferta}) => {

  const [productoCompra, setProductoCompra] = useState({});
  const [proveedorCompra, setProveedorCompra] = useState({});

  const getProductoById = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${oferta?.IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProductoCompra(producto[0]);
  }

  const getProveedorById = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${oferta?.IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedorCompra(proveedor[0]);
  }

  useEffect(() => {
    !!oferta && getProductoById();
    !!oferta && getProveedorById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])

  return (
    <Link 
      to={`/oferta/${oferta?.IdOferta}`} 
      key={oferta?.IdOferta} 
      className="actividadesRec__lista__item"
    >
    <div className="actividadesRec__lista__item__enCurso"></div>
    {/* <span className="material-symbols-rounded icon--sm actividadesRec__lista__item__delete">
      cancel
    </span> */}
    <p className="paragraph--mid--2"><b>{productoCompra?.Name}</b></p>
    <p className="paragraph--mid--2">$ {oferta?.ValorUProducto}</p>
    <p className="paragraph--mid--2">{proveedorCompra?.Nombre}</p>
    <p className="paragraph--mid--2">{(oferta?.FechaLimite)?.split("T")[0]}</p>
  </Link>
  )
}
