import React from "react";
import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { ContListaActItem } from "./ContListaActItem";

export const ContListaAct = React.memo(() => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [comprasPendientesByUser, setComprasPendientesByUser] = useState([])
  const [ofertasActivasByComp, setOfertasActivasByComp] = useState([]);

  const getComprasPendientesByUser = async() => {
    const resp = await fetch(`${apiUrl}/compras?idComprador=${user.IdUsuario}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    setComprasPendientesByUser(compras.filter((compra) => compra.IdEstado !== 9));
  }

  const getOfertasActivasByCompra = () => {
    comprasPendientesByUser?.forEach( async(compra) => {
      const resp = await fetch(`${apiUrl}/ofertas?id=${compra?.IdOferta}`);
      const data = await resp.json();
      const {rows: oferta} = !!data && data;
      setOfertasActivasByComp((ofertas) => {
        //se agrega si la oferta está En Curso o Pendiente 
        if(oferta[0].IdEstadosOferta === 1 || oferta[0].IdEstadosOferta === 11){
          return [oferta[0], ...ofertas];
        }
        //retorna estado anterior
        return ofertas;
      })
    })
  }

  useEffect(() => {
    getComprasPendientesByUser();
    setOfertasActivasByComp([])
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    !!comprasPendientesByUser && getOfertasActivasByCompra();
    // eslint-disable-next-line
  }, [comprasPendientesByUser])

  const showEmptyArray = ofertasActivasByComp?.length === 0;

  return (
    <div className="actividadesRec__lista">
      {showEmptyArray
        ? <p className="paragraph">No tienes ofertas activas</p>
        :
        ofertasActivasByComp?.map(ofertaActiva => {
          return <ContListaActItem ofertaActiva={ofertaActiva} key={ofertaActiva.IdOferta}/>
        })
      }
    </div>
  )
});
