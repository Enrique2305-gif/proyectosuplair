import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { BuscadorAdm, ContNavegar, OfertaCardAdm } from "../components";

export const AdmOfertasPage = () => {

  const [ofertasTodos, setOfertasTodos] = useState();
  const showEmptyArray = ofertasTodos?.length === 0;

  const getOfertasTodos = async() => {
    const resp = await fetch(`${apiUrl}/ofertas`);
    const data = await resp.json();
    const {rows: ofertas} = !!data && data;
    setOfertasTodos(ofertas);
  }

  useEffect(() => {
    getOfertasTodos();
  }, [])

  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Ofertas colaborativas</h1>
        <hr className="hrGeneral"/>
        <div>
          <div className="admBusquedaBox">
            <BuscadorAdm tipoBusqueda={"oferta"}/>
          </div>
          <div className="admOfertasContainer">
            {showEmptyArray
              ? <p className="paragraph">Por el momento no hay ofertas disponibles</p>
              :
              ofertasTodos?.map(oferta => (
                <OfertaCardAdm 
                  key={oferta.IdOferta}
                  oferta={oferta}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
