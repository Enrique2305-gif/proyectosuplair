import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { apiUrl } from "../../apiUrl";

export const ContListaProvCompItem = ({compraPagada}) => {

  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [oferta, setOferta] = useState();

  const getProducto = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${oferta?.IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getProveedor = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${oferta?.IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  const getOferta = async() => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${compraPagada.IdOferta}`);
    const data = await resp.json();
    const {rows: oferta} = !!data && data;
    setOferta(oferta[0]);
  }

  useEffect(() => {
    !!oferta && getProducto();
    !!oferta && getProveedor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])

  useEffect(() => {
    getOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compraPagada])
  

  return (
    <Link 
    to={`/venta_individual/${compraPagada.IdCompra}`} 
    key={compraPagada.IdCompra} 
    className="actividadesRec__lista__item"
  >
    <div className="actividadesRec__lista__item__enCurso"></div>
    {/* <span className="material-symbols-rounded icon--sm actividadesRec__lista__item__delete">
      cancel
    </span> */}
    <p className="paragraph--mid--2"><b>{producto?.Name}</b></p>
    <p className="paragraph--mid--2">{proveedor?.Nombre}</p>
    <p className="paragraph--mid--2">{(oferta?.FechaLimite)?.split("T")[0]}</p>
  </Link>
  )
}
