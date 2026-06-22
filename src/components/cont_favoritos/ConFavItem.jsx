import React from "react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { apiUrl } from "../../apiUrl";

export const ConFavItem = ({fav}) => {

  const [proveedorData, setProveedorData] = useState({});

  const getFetch = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${fav.IdUsuarioProv}`);
    const data = await resp.json();
    const {rows: prov} = data;
    setProveedorData(prov[0])
  }

  useEffect(() => {
    
    !!fav && getFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fav])

  return (
    <Link 
      to={`/perfil_proveedor?q=${fav.IdUsuarioProv}`} 
      key={fav.IdProvFavorito} 
      className="explorarCat__lista__item"
    >
      <span className="material-symbols-rounded icon--sm">
        star
      </span>
      <p className="paragraph--mid--2">{proveedorData?.Nombre}</p>
    </Link>
  )
}
