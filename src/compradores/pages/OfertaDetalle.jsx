import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import {
  ContExplorar,
  ContFavoritos,
  EtiquetaOferta,
  ProgressBar,
  ValoracionStar,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ContOfertasSimilares } from "../../components/cont_ofertasSimilares/ContOfertasSimilares";
import {
  CompraAnticipada,
  CompraProductos,
  CompraReserva,
  ErrorPago,
  ListaOrdenComp,
  MetodoPago,
  PagoExito,
} from "../components";
import { CompraInstantanea } from "../components/CompraInstantanea";
import { InstantaneaExitosa } from "../components/InstantaneaExitosa";
import { ProdDemandaButtonBox } from "../components";
export const OfertaDetalle = () => {
  const { ofertaId: idOferta } = useParams();
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [oferta, setOferta] = useState();
  const [producto, setProducto] = useState();
  const [estadoOferta, setEstadoOferta] = useState();
  const [proveedor, setProveedor] = useState();
  const [yaSeHaUnido, setYaSeHaUnido] = useState(false);

  const [costoTotal, setCostoTotal] = useState(0.0);
  const [unidadesPetUsuario, setUnidadesPetUsuario] = useState(0);

  const [showCompraProductos, setShowCompraProductos] = useState(false);
  const [showCompraInstantanea, setShowCompraInstantanea] = useState(false);
  const [showMetodoPago, setShowMetodoPago] = useState(false);
  const [showPagoReserva, setShowPagoReserva] = useState(false);
  const [showPagoAnticipado, setShowPagoAnticipado] = useState(false);
  const [showPagoExito, setShowPagoExito] = useState(false);
  const [showErrorPago, setShowErrorPago] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const [showInstantaneaExitosa, setShowInstantaneaExitosa] = useState(false);

  const getOferta = async () => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${idOferta}`);
    const data = await resp.json();
    const { rows: oferta } = !!data && data;
    setOferta(oferta[0]);
  };

  const getProducto = async () => {
    const resp = await fetch(`${apiUrl}/productos?id=${oferta.IdProducto}`);
    const data = await resp.json();
    const { rows: producto } = !!data && data;
    setProducto(producto[0]);
  };

  const getEstadoOferta = async () => {
    const resp = await fetch(`${apiUrl}/estados?id=${oferta.IdEstadosOferta}`);
    const data = await resp.json();
    const { rows: estado } = !!data && data;
    setEstadoOferta(estado[0]);
  };

  const getProveedor = async () => {
    const resp = await fetch(
      `${apiUrl}/usuarios?idUsuario=${oferta.IdProveedor}`
    );
    const data = await resp.json();
    const { rows: proveedor } = !!data && data;
    setProveedor(proveedor[0]);
  };

  const getComprasByComprador = async () => {
    const resp = await fetch(`${apiUrl}/compras?idComprador=${user.IdUsuario}`);
    const data = await resp.json();
    const { rows: compras } = !!data && data;
    return compras;
  };

  const checkSiSeHaUnido = () => {
    //obtener lista de compras del usuario y si concide con esta oferta, disable = true
    getComprasByComprador().then((res) => {
      res.forEach((compra) => {
        if (compra.IdOferta === oferta.IdOferta) {
          setYaSeHaUnido(true);
        }
      });
    });
  };

  useEffect(() => {
    getOferta();
    // eslint-disable-next-line
  }, [idOferta]);

  useEffect(() => {
    !!oferta && getProducto();
    !!oferta && getEstadoOferta();
    !!oferta && getProveedor();
    !!oferta && checkSiSeHaUnido();
    // eslint-disable-next-line
  }, [oferta]);

  const getOfertaActualizada = async () => {
    const resp = await fetch(`${apiUrl}/ofertas?id=${oferta?.IdOferta}`);
    const data = await resp.json();
    const { rows: ofertaAct } = !!data && data;
    return ofertaAct[0].IdEstadosOferta;
  };

  const handleClickUnirse = () => {
    getOfertaActualizada().then((res) => {
      if (res !== 1) {
        console.warn("No puede unirse, la oferta ya ha sido cerrada.");
      } else {
        setShowCompraProductos(true);
      }
    });
  };

  const handleClickInst = () => {
    getOfertaActualizada().then((res) => {
      if (res !== 1) {
        console.warn("No puede unirse, la oferta ya ha sido cerrada.");
      } else {
        setShowCompraInstantanea(true);
      }
    });
  };

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContMenu />
        <ProdDemandaButtonBox />
        <ContExplorar />
        <ContFavoritos />
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
          <div className="explorarCat__title">
            <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
            </span>
            <p className="paragraph--mid">
              <b>{producto?.Name}</b>
            </p>
          </div>
          <div className="oferta-card__etiquetaBox">
            <EtiquetaOferta
              estado={estadoOferta?.Descripcion}
              esOfertaDetalle={true}
            />
            {yaSeHaUnido && (
              <EtiquetaOferta estado={"Unido"} esOfertaDetalle={true} />
            )}
          </div>
          <hr className="hrGeneral" />
          <div className="oferta-detalle__productoBox u-margin-top-small">
            <div className="oferta-detalle__productoBox__imgBox">
              <img
                className="oferta-detalle__productoBox__imgBox__img"
                src={
                  producto?.UrlImg === "no-img.jpeg"
                    ? "/no-img.jpeg"
                    : producto?.UrlImg
                }
                alt={producto?.Name}
              />
            </div>
            <div className="oferta-detalle__productoBox__desc">
              <ValoracionStar cant_estrellas={producto?.Valoracion} />
              <div className="oferta-detalle__productoBox__desc__text">
                <p className="paragraph">{producto?.Descripcion}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">
                  <b>Proveedor: {proveedor?.Nombre}</b>
                </p>
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">
                  <b>Precio unitario:</b> {"$" + oferta?.ValorUProducto}
                </p>
              </div>
            </div>
            {oferta?.ValorUInstantaneo > 0 && (
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">
                  <b>Precio de compra instantánea:</b>{" "}
                  {"$" + oferta?.ValorUInstantaneo}
                </p>
              </div>
            )}
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">
                  Unidades restantes:&nbsp;
                  {oferta?.Maximo - oferta?.ActualProductos}&nbsp;/&nbsp;
                  {oferta?.Maximo}
                </p>
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small">
                <p className="paragraph">
                  Fecha de cierre:{" "}
                  {!!oferta?.FechaLimite && oferta.FechaLimite.split("T")[0]}
                </p>
              </div>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">{oferta?.Descripcion}</p>
            </div>

            <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph paragraph--blue">
                Unidades restantes para completar el mínimo:&nbsp;
                {oferta?.Minimo - oferta?.ActualProductos >= 0
                  ? oferta?.Minimo - oferta?.ActualProductos
                  : 0}
              </p>
            </div>

            <div className="oferta-detalle__productoProgress u-margin-top-small">
              <p className="paragraph">Progreso de unidades vendidas: </p>
              <div className="oferta-detalle__productoProgress__barbox">
                <ProgressBar
                  cantMax={oferta?.Maximo}
                  actualProductos={oferta?.ActualProductos}
                />
              </div>
              <p className="paragraph paragraph--blue">
                {((oferta?.ActualProductos / oferta?.Maximo) * 100).toFixed(0)}%
              </p>
            </div>

            {/* antes de unirse, verificar que haya vinculado el método de pago */}
            {estadoOferta?.Descripcion === "En curso" && !yaSeHaUnido && (
              <div className="oferta-detalle__btnBox">
                <button
                  disabled={yaSeHaUnido}
                  className={yaSeHaUnido ? "btn btn--grey" : "btn btn--blue"}
                  onClick={handleClickUnirse}
                >
                  Unirse
                </button>
                <button
                  class="btn btn--green"
                  disabled={oferta.ValorUInstantaneo === 0}
                  onClick={handleClickInst}
                >
                  Pagar ahora
                </button>
              </div>
            )}
            {yaSeHaUnido && <ListaOrdenComp oferta={oferta} />}
            {/* ventana para confirmar comprar */}
            {showCompraProductos && (
              <CompraProductos
                setShowCompraProductos={setShowCompraProductos}
                setShowMetodoPago={setShowMetodoPago}
                oferta={oferta}
                producto={producto}
                costoTotal={costoTotal}
                setCostoTotal={setCostoTotal}
                setUnidadesPetUsuario={setUnidadesPetUsuario}
              />
            )}
            {showCompraInstantanea && (
              <CompraInstantanea
                setShowCompraInstantanea={setShowCompraInstantanea}
                setShowInstantaneaExitosa={setShowInstantaneaExitosa}
                oferta={oferta}
                producto={producto}
                costoTotal={costoTotal}
                setCostoTotal={setCostoTotal}
                setUnidadesPetUsuario={setUnidadesPetUsuario}
              />
            )}
            {/* ventana para confirmar metodo de pago */}
            {showMetodoPago && (
              <MetodoPago
                setShowMetodoPago={setShowMetodoPago}
                setShowPagoReserva={setShowPagoReserva}
                setShowPagoAnticipado={setShowPagoAnticipado}
                setTipoPago={setTipoPago}
              />
            )}
            {showPagoAnticipado && (
              <CompraAnticipada
                setShowPagoAnticipado={setShowPagoAnticipado}
                unidadesPetUsuario={unidadesPetUsuario}
                setShowPagoExito={setShowPagoExito}
                setShowErrorPago={setShowErrorPago}
                costoTotal={costoTotal}
                oferta={oferta}
              />
            )}
            {showPagoReserva && (
              <CompraReserva
                setShowPagoReserva={setShowPagoReserva}
                unidadesPetUsuario={unidadesPetUsuario}
                setShowPagoExito={setShowPagoExito}
                setShowErrorPago={setShowErrorPago}
                costoTotal={costoTotal}
                oferta={oferta}
              />
            )}
            {showPagoExito && (
              <PagoExito
                tipoPago={tipoPago}
                setShowPagoExito={setShowPagoExito}
              />
            )}
            {showInstantaneaExitosa && (
              <InstantaneaExitosa
                setShowInstantaneaExitosa={setShowInstantaneaExitosa}
              />
            )}
            {showErrorPago && (
              <ErrorPago
                tipoPago={tipoPago}
                setShowErrorPago={setShowErrorPago}
              />
            )}
          </div>
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContOfertasSimilares
          nombreProducto={producto?.Name}
          idOferta={idOferta}
        />
      </div>
    </div>
  );
};
