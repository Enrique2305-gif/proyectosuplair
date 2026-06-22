import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiUrl } from "../../apiUrl";

export const ContListaActProvItem = ({ofertaActiva}) => {

  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();

  const getProducto = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${ofertaActiva.IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getProveedor = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${ofertaActiva.IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  useEffect(() => {
    getProducto();
    getProveedor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ofertaActiva])
  
  return (
    <Link 
      to={`/mi_oferta/${ofertaActiva.IdOferta}`} 
      key={ofertaActiva.IdOferta} 
      className="actividadesRec__lista__item"
    >
      <div className="actividadesRec__lista__item__enCurso"></div>
      {/* <span className="material-symbols-rounded icon--sm actividadesRec__lista__item__delete">
        cancel
      </span> */}
      <p className="paragraph--mid--2"><b>{producto?.Name}</b></p>
      <p className="paragraph--mid--2">{proveedor?.Nombre}</p>
      <p className="paragraph--mid--2">{(ofertaActiva.FechaLimite).split("T")[0]}</p>
    </Link>

  )
}
