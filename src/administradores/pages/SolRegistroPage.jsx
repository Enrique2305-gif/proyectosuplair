import { BuscadorAdm } from "../components"
import { ContNavegar } from "../components/ContNavegar"
import { CardSolicitudRegistro } from "../components/CardSolicitudRegistro";
import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
export const SolRegistroPage = () => {

  const [solicitudesTodas, setSolicitudesTodas] = useState([]);
  const showEmptySTArray = solicitudesTodas?.length === 0;

  const getSolicitudesTodas = async() => {
    const resp = await fetch(`${apiUrl}/solicitudRegistro`,{
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const data = await resp.json();
    const {rows: solicitudes} = !!data && data;
    setSolicitudesTodas(solicitudes);
  }

  useEffect(() => {
    getSolicitudesTodas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  
  
  
  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Solicitudes de registro</h1>
        <hr className="hrGeneral"/>
        <div className="admBusquedaBox">
          <BuscadorAdm tipoBusqueda={"solicitudes"}/>
        </div>
        <div className="admPrincipalContainer">
          {
            showEmptySTArray
            ? <p className="paragraph"> Por el momento no hay solicitudes registradas</p>
            :
            solicitudesTodas?.map(solicitud => {
              return <CardSolicitudRegistro solicitud={solicitud} key={solicitud.IdSolicitud}/>
            })
          }
        </div>
      </div>
    </div>
  )
}
