import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { ContListaActProvItem } from "./ContListaActProvItem";

export const ContListaActProv = () => {

  const {authState} = useContext(AuthContext);
  const {user: proveedor} = authState;

  const [ofertasActivasByProv, setOfertasActivasByProv] = useState();

  const getOfertasActivasByIdProveedor = async(id) => {
    const resp = await fetch(`${apiUrl}/ofertas?idProveedor=${id}&idEstadosOferta=1`);
    const data = await resp.json();
    const {rows: ofertasActivas} = !!data && data;
    setOfertasActivasByProv(ofertasActivas);
  }
  
  const showEmptyArray = ofertasActivasByProv?.length === 0;

  useEffect(() => {
    getOfertasActivasByIdProveedor(proveedor.IdUsuario);
  }, [proveedor])
  
  return (
    <div className="actividadesRec__lista">
      {showEmptyArray
        ? <p className="paragraph">No tienes ofertas activas</p>
        :
        ofertasActivasByProv?.map(ofertaActiva => 
          <ContListaActProvItem 
            ofertaActiva={ofertaActiva}
            key={ofertaActiva.IdOferta}
          />)
      }
    </div>
  )
}
