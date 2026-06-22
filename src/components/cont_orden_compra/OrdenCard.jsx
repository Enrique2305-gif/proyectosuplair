import React from "react"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { EtiquetaOferta } from "./EtiquetaOferta"
import { ProgressBar } from "./ProgressBar";
import { ReportarCompra } from "./ReportarCompra";
import { ReportarTooltip } from "./ReportarTooltip";
import { ReporteEnviado } from "./ReporteEnviado";

export const OrdenCard = ({compra, esProveedor = false}) => {

  const navigate = useNavigate();
  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const onClickOferta = () => {
    !esProveedor 
    ?
    navigate(`/oferta_individual/${compra.IdCompra}`)
    :
    navigate(`/venta_individual/${compra.IdCompra}`);
  }

  const [oferta, setOferta] = useState();


  const {IdProducto,
        IdProveedor, 
        Maximo,
        ActualProductos,
        FechaLimite,
        IdEstadosOferta,
      } = !!oferta && oferta;

  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [estadoOferta, setEstadoOferta] = useState();
  const [nombreProveedor, setNombreProveedor] = useState();
  const [datosProd, setDatosProd] = useState({});
  const [yaSeHaUnido, setYaSeHaUnido] = useState(false);
  const [showReportarTooltip, setShowReportarTooltip] = useState(false);
  const [showVentanaReportar, setShowVentanaReportar] = useState(false);
  const [showReporteEnviado, setShowReporteEnviado] = useState(false);

  const getOferta = async() => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${compra?.IdOferta}`);
    const data = await resp.json();
    const {rows: oferta} = !!data && data;
    setOferta(oferta[0]);
  }

  const getProductoOferta = async() => {
    const resp = await fetch(`${apiUrl}/productos?id=${IdProducto}`);
    const data = await resp.json();
    const {rows: producto} = !!data && data;
    setProducto(producto[0]);
  }

  const getProveedorOferta = async() => {
    const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${IdProveedor}`);
    const data = await resp.json();
    const {rows: proveedor} = !!data && data;
    setProveedor(proveedor[0]);
  }

  const getEstadoOferta = async() => {
    const resp = await fetch(`${apiUrl}/estados?id=${IdEstadosOferta}`);
    const data = await resp.json();
    const {rows: estado} = !!data && data;
    setEstadoOferta(estado[0]);
  }

  useEffect(() => {
    !!oferta && getProductoOferta();
    !!oferta && getProveedorOferta();
    !!oferta && getEstadoOferta();
    !!oferta && checkSiSeHaUnido();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])


  useEffect(() => {
    getOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compra])
  

  useEffect(() => {
    setNombreProveedor(proveedor?.Nombre);
  }, [proveedor])
  
  useEffect(() => {
    setDatosProd({
      nombreProd: producto?.Name,
      costoU: oferta?.ValorUProducto,
      urlImg: producto?.UrlImg,
    })
  
  }, [producto, oferta])

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
        if(compra.IdOferta === oferta?.IdOferta){
          setYaSeHaUnido(true);
        }
      });
    })
  }

  const onShowReportarTooltip = () => {
    setShowReportarTooltip(true);
  }

  const onClickOutside = () => {
    setShowReportarTooltip(false);
  }

  return (
    <div className="oferta-card-main">
      <div className="oferta-card u-margin-top-small animate__animated animate__fadeIn">
      <div className="oferta-card__imgbox">
        <img className="oferta-card__imgbox__img" src={datosProd?.urlImg} alt={datosProd?.nombreProd}/>
      </div>
      <div className="oferta-card__datosbox">
        <div className="oferta-card__etiquetaBox">
        { esProveedor && estadoOferta?.Descripcion === "Cerrado" 
          ?<EtiquetaOferta estado={"Verificando pagos"}/>
          :<EtiquetaOferta estado={estadoOferta?.Descripcion}/>
        }
        {
          !esProveedor && yaSeHaUnido &&
          <EtiquetaOferta estado={"Unido"} styleName="oferta-card__etiqueta2"/>
        }
        </div>
        {!esProveedor &&
          <div className="oferta-card-reportarBox">
            <span className="material-symbols-rounded icon--md" onClick={onShowReportarTooltip}>
              more_vert
            </span>
          </div>
        }
        {
          !esProveedor && showReportarTooltip  &&
          <ReportarTooltip 
            esOferta={true}
            onClickOutside={onClickOutside}
            setShowVentanaReportar={setShowVentanaReportar}
          />
        }
        <div className="oferta-card__datosbox__title u-margin-bottom-small" onClick={onClickOferta}>
          <p className="paragraph paragraph--bold paragraph--mid">{datosProd?.nombreProd}</p>
          <p className="paragraph">{nombreProveedor}</p>
        </div>
        <div className="oferta-card__datosbox__otros">
          <div className="oferta-card__datosbox__otros__der">
            <p className="paragraph">En oferta: {Maximo - ActualProductos} / { Maximo }</p>
            <ProgressBar 
              actualProductos={ActualProductos} 
              cantMax={Maximo}
            />
            <p className="paragraph">Fecha vigencia: {FechaLimite?.split("T")[0]}</p>
          </div>
          <div>
            <p className="paragraph u-padding-right-medium">Precio unitario: {"$" + datosProd?.costoU}</p>
          </div>
        </div>
      </div>
      </div>
      {
        showVentanaReportar
        &&
        <ReportarCompra
          setShowVentanaReportar={setShowVentanaReportar}
          setShowReporteEnviado={setShowReporteEnviado}
          oferta={oferta}
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
