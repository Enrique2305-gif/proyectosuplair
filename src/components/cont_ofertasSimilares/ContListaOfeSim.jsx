import React from "react"
import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { ContOfeSimListaItem } from "./ContOfeSimListaItem";

export const ContListaOfeSim = ({nombreProducto, idOferta}) => {

  console.log(nombreProducto)

  const [ofertasSimilares, setOfertasSimilares] = useState([]);

  const getOfertasSimilares = async() => {
    const resp = await fetch(`${apiUrl}/ofertabyproductolike?nombreProducto=${nombreProducto}`);
    const data = await resp.json();
    const {rows: ofertas} = !!data && data;
    setOfertasSimilares(ofertas.filter((oferta) => 
      oferta?.IdOferta !== parseInt(idOferta)
      && oferta?.IdEstadosOferta === 1 
    ));
  }

  console.log(ofertasSimilares)

  useEffect(() => {
    getOfertasSimilares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreProducto])
  
  const showEmptyArray = ofertasSimilares?.length === 0;

  return (
    <div className="actividadesRec__lista">
    {showEmptyArray
      ? <p className="paragraph">No se encontraron ofertas</p>
      :
      ofertasSimilares?.map(ofertaActiva => {
        return <ContOfeSimListaItem ofertaActiva={ofertaActiva} key={ofertaActiva.IdOferta}/>
      })
    }
  </div>
  )
}
