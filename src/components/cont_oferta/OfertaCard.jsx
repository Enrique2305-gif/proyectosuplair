import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { EtiquetaOferta } from "./EtiquetaOferta"
import { ProgressBar } from "./ProgressBar";
import { ReportarOferta } from "./ReportarOferta";
import { ReportarTooltip } from "./ReportarTooltip";
import { ReporteEnviado } from "./ReporteEnviado";

export const OfertaCard = ({oferta, esProveedor = false}) => {

  const navigate = useNavigate();
  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const fallbackImg = "/no-img.jpeg";

  const onClickOferta = () => {
    !esProveedor 
    ?
    navigate(`/oferta/${oferta.IdOferta}`)
    :
    navigate(`/mi_oferta/${oferta.IdOferta}`);
  }
  const {IdProducto,
        IdProveedor, 
        Maximo,
        ActualProductos,
        FechaLimite,
        IdEstadosOferta,
      } = oferta;

  const [producto, setProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [estadoOferta, setEstadoOferta] = useState();
  const [nombreProveedor, setNombreProveedor] = useState();
  const [datosProd, setDatosProd] = useState({});
  const [yaSeHaUnido, setYaSeHaUnido] = useState(false);
  const [showReportarTooltip, setShowReportarTooltip] = useState(false);
  const [showVentanaReportar, setShowVentanaReportar] = useState(false);
  const [showReporteEnviado, setShowReporteEnviado] = useState(false);

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
    getProductoOferta();
    getProveedorOferta();
    getEstadoOferta();
    checkSiSeHaUnido();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta])

  useEffect(() => {
    setNombreProveedor(proveedor?.Nombre);
  }, [proveedor])
  
  useEffect(() => {
    setDatosProd({
      nombreProd: producto?.Name,
      costoU: oferta.ValorUProducto,
      costoInst: oferta.ValorUInstantaneo,
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
        if(compra.IdOferta === oferta.IdOferta){
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
        <img
          className="oferta-card__imgbox__img"
          src={datosProd?.urlImg || fallbackImg}
          alt={datosProd?.nombreProd || "Producto sin imagen"}
          onError={(e) => { e.currentTarget.src = fallbackImg; }}
        />
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
          <div className="oferta-card__logoBox">
            <p className="paragraph">{nombreProveedor}</p>
            <div className="oferta-card__logoBox__imgBox">
            {/* <img src={proveedor?.UrlLogoEmpresa} alt={proveedor?.Nombre} className="oferta-card__logoBox__imgBox__img" />*/}
            </div>
          </div>
        </div>
        <div className="oferta-card__datosbox__otros">
          <div className="oferta-card__datosbox__otros__der">
            <p className="paragraph">En oferta: {Maximo - ActualProductos} / { Maximo }</p>
            <ProgressBar 
              actualProductos={ActualProductos} 
              cantMax={Maximo}
            />
            <p className="paragraph">Fecha vigencia: {FechaLimite?.split("T")?.[0] || "Sin fecha"}</p>
          </div>
          <div>
            <p className="paragraph u-padding-right-mediumresp">Precio unitario: {"$" + datosProd?.costoU}</p>
            {
              datosProd?.costoInst>0 &&
            <p className="paragraph u-padding-right-mediumresp">Precio instantáneo: {"$" + datosProd?.costoInst}</p>
            }
            {
              datosProd?.costoInst<=0 &&
            <p className="paragraph u-padding-right-mediumresp">Precio instantáneo: -- </p>
            }  
            
          </div>
          
        </div>

      </div>
      </div>
      {
        showVentanaReportar
        &&
        <ReportarOferta
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
