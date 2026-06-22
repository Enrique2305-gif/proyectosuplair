import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { EtiquetaDemanda } from "./EtiquetaDemanda"
import { ProgressBar } from "../cont_oferta/ProgressBar";
import { ReportarDemanda } from "./ReportarDemanda";
import { ReportarTooltip } from "../cont_oferta/ReportarTooltip";
import { ReporteEnviado } from "../cont_oferta/ReporteEnviado";

export const DemandaCard = ({demanda, esComprador = false}) => {

  const navigate = useNavigate();
  const {authState} = useContext(AuthContext);
  const {user} = authState;

 
  const fallbackImg = "/no-img.jpeg";

  const onClickDemanda = () => {
    !esComprador 
    ?
    navigate(`/demanda/${demanda.IdDemanda}`)
    :
    navigate(`/mi_demanda/${demanda.IdDemanda}`);
  }

  const {IdProducto,
        IdComprador, 
        Maximo,
        ActualProductos,
        FechaLimite,
        IdEstadosOferta,
      } = demanda;

  const [producto, setProducto] = useState();
  const [comprador, setComprador] = useState();
  const [estadoOferta, setEstadoDemanda] = useState();
  const [nombreComprador, setNombreComprador] = useState();
  const [datosProd, setDatosProd] = useState({});
  const [yaSeHaUnido, setYaSeHaUnido] = useState(false);
  const [showReportarTooltip, setShowReportarTooltip] = useState(false);
  const [showVentanaReportar, setShowVentanaReportar] = useState(false);
  const [showReporteEnviado, setShowReporteEnviado] = useState(false);

  const getProductoDemanda = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getCompradorDemanda = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${IdComprador}`);
    const data = await resp.json();
    const {rows: comprador} = !!data && data;
    setComprador(comprador[0]);
  }

  const getEstadoDemanda = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${IdEstadosOferta}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoDemanda(estado[0]);
  }


  useEffect(() => {
    setNombreComprador(comprador?.Nombre);
  }, [comprador])
  
  useEffect(() => {
    setDatosProd({
      nombreProd: producto?.Name,
      precioMin: demanda.PrecioMinimo,
      precioMax: demanda.PrecioMaximo,
      urlImg: producto?.UrlImg,
    })
  
  }, [producto, demanda])

  const getComprasByComprador = async() => {
    const resp = await fetch(`${apiUrl}/compras?idComprador=${user.IdUsuario}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    return compras;
  }

  const checkSiSeHaUnido = () => {
    //obtener lista de compras del usuario y si concide con esta oferta, disable = true
    getComprasByComprador()
    .then(res => {
      res.forEach(compra => {
        if(compra.IdDemanda === demanda.IdDemanda){
          setYaSeHaUnido(true);
        }
      });
    })
  }
  useEffect(() => {
    getProductoDemanda();
    getCompradorDemanda();
    getEstadoDemanda();
    checkSiSeHaUnido();
    // eslint-disable-next-line
  }, [demanda])
  const onShowReportarTooltip = () => {
    setShowReportarTooltip(true);
  }

  const onClickOutside = () => {
    setShowReportarTooltip(false);
  }
  const verPropuestasRecibidas = () => {
    navigate(`/propuestas_recibidas`, { state: { IdDemanda: demanda.IdDemanda, Producto: datosProd?.nombreProd  } });
  };
  return (
    <div className="oferta-card-main">
      <div className="oferta-card u-margin-top-small animate__animated animate__fadeIn">
      <div className="oferta-card__imgbox">
        <img
          className="oferta-card__imgbox__img"
          src={datosProd?.urlImg || fallbackImg}
          alt={datosProd?.nombreProd || "Producto sin imagen"}
          onError={(e) => { e.currentTarget.src = fallbackImg; }}
        />
      </div>
      <div className="oferta-card__datosbox">
        <div className="oferta-card__etiquetaBox">
        { esComprador && estadoOferta?.Descripcion === "Cerrado" 
          ?<EtiquetaDemanda estado={"Verificando pagos"}/>
          :<EtiquetaDemanda estado={estadoOferta?.Descripcion}/>
        }
        {
          !esComprador && yaSeHaUnido &&
          <EtiquetaDemanda estado={"Unido"} styleName="oferta-card__etiqueta2"/>
        }
        </div>
        {!esComprador &&
          <div className="oferta-card-reportarBox">
            <span className="material-symbols-rounded icon--md" onClick={onShowReportarTooltip}>
              more_vert
            </span>
          </div>
        }
        {
          !esComprador && showReportarTooltip  &&
          <ReportarTooltip 
            esOferta={true}
            onClickOutside={onClickOutside}
            setShowVentanaReportar={setShowVentanaReportar}
          />
        }
        <div className="oferta-card__datosbox__title u-margin-bottom-small" onClick={onClickDemanda}>
          <p className="paragraph paragraph--bold paragraph--mid">{datosProd?.nombreProd}</p>
          <div className="oferta-card__logoBox">
            <p className="paragraph">{nombreComprador}</p>
            <div className="oferta-card__logoBox__imgBox">
            {/* <img src={proveedor?.UrlLogoEmpresa} alt={proveedor?.Nombre} className="oferta-card__logoBox__imgBox__img" />*/}
            </div>
          </div>
        </div>
        <div className="oferta-card__datosbox__otros">
          <div className="oferta-card__datosbox__otros__der">
            <p className="paragraph"><b>Se demanda: </b>{Maximo}</p>
            <p className="paragraph"><b>Actual:</b> {ActualProductos} / { Maximo }</p>
            <ProgressBar 
              actualProductos={ActualProductos} 
              cantMax={Maximo}
            />
            <p className="paragraph"><b>Fecha vigencia:</b> {FechaLimite?.split("T")?.[0] || "Sin fecha"}</p>
          </div>
          <div>
            <p className="paragraph u-padding-right-mediumresp"><b>Precio Mínimo:</b> {"$" + datosProd?.precioMin}</p>
            
            <p className="paragraph u-padding-right-mediumresp"><b>Precio Máximo:</b> {"$" + datosProd?.precioMax}</p>
            
          </div>
        </div>
        <div>
            <div className="button-container">
                <button className="btn btn--blue" onClick={verPropuestasRecibidas}>Propuestas </button>
            </div>
        </div>
      </div>
      </div>
      {
        showVentanaReportar
        &&
        <ReportarDemanda
          setShowVentanaReportar={setShowVentanaReportar}
          setShowReporteEnviado={setShowReporteEnviado}
          demanda={demanda}
          producto={producto}
        />
      }
      {
        showReporteEnviado
        && 
        <ReporteEnviado
          texto={"Su reporte ha sido enviado a los administradores del sistema. Se le notificará cuando sea atendido."}
          setShowReporteEnviado={setShowReporteEnviado}
        />
      }
    </div>
  )
}