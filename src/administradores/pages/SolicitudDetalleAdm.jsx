import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
//import { EtiquetaOferta, ProgressBar, ValoracionStar } from "../../components";
import { ContNavegar } from "../components"

export const SolicitudDetalleAdm = () => {

  
    

  const {idSolicitud} = useParams();
  const [solicitud, setSolicitud] = useState();

  let dateObj = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const getSolicitud = async() => {
    const resp = await fetch(`${apiUrl}/solicitudRegistro?id=${idSolicitud}`);
    const data = await resp.json();
    const {rows: solicitud} = !!data && data;
    setSolicitud(solicitud[0]);
    dateObj = new Date(solicitud.FechaSolicitud);
  }


  useEffect(() => {
    getSolicitud();
    // eslint-disable-next-line
  }, [idSolicitud])

  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Solicitud detalle  &gt; {solicitud?.Nombre}</h1>
        <hr className="hrGeneral"/>
        <div className="admPrincipalContainer">
          <div className="oferta-detalle__productoBox u-margin-top-small">
            <div className="oferta-detalle__productoBox__imgBox">
            <img 
                className="oferta-detalle__productoBox__imgBox__img" 
                src={solicitud?.UrlLogoEmpresa === "no-img.jpeg" ? "/no-img.jpeg" : solicitud?.UrlLogoEmpresa} 
                alt={solicitud?.Nombre} 
              />
            </div>
              <div className="oferta-detalle__productoBox__desc__text">
                <p className="paragraph"><b>{solicitud?.Nombre}</b></p>
                <p className="paragraph">{solicitud?.Usuario}</p>
              </div>
            </div>
          </div>
          <div>
          <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph"> <b>Rol: </b>Proveedor
              </p>
            </div>
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph"><b>Identificación: </b>{solicitud?.Identificacion}</p>
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph"><b>Teléfono: </b>{solicitud?.Numero}</p>
              </div>
            </div>
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph"><b>Provincia: </b>{solicitud?.Provincia}
                </p>
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph"><b>Ciudad: </b>{solicitud?.Ciudad}</p>
              </div>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">{solicitud?.Direccion}</p>
            </div>
            <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph">Fecha solicitud: {dateObj.toLocaleString(undefined, options)}
              </p>
            </div>


            

          </div>
        </div>
      </div>
    
  )
}
