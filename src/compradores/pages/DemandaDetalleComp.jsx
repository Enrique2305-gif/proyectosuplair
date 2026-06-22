import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import {
  ContActividades,
  ContExplorar,
  ContFavoritos,
} from "../../components";
import { ContMenu } from "../../components/cont_menu/ContMenu";
import { ProgressBar } from "../../components/cont_oferta/ProgressBar";
import { EtiquetaDemanda } from "../../components/cont_demanda/EtiquetaDemanda";
import { ProdDemandaButtonBox } from "../components";

export const DemandaDetalleComp = () => {
  const { demandaId } = useParams();
  const navigate = useNavigate();

  const [demanda, setDemanda] = useState(null);
  const [producto, setProducto] = useState(null);
  const [estadoDemanda, setEstadoDemanda] = useState(null);
  const [loading, setLoading] = useState(false);

  const fallbackImg = "/no-img.jpeg";

  const getDemandaDetalle = async () => {
    try {
      setLoading(true);

      const respDemanda = await fetch(`${apiUrl}/demandas?id=${demandaId}`);
      const dataDemanda = await respDemanda.json();
      const demandaData = dataDemanda?.rows?.[0];

      if (!demandaData) {
        setDemanda(null);
        return;
      }

      setDemanda(demandaData);

      const [respProducto, respEstado] = await Promise.all([
        fetch(`${apiUrl}/productos?id=${demandaData.IdProducto}`),
        fetch(`${apiUrl}/estados?id=${demandaData.IdEstadosOferta}`),
      ]);

      const dataProducto = await respProducto.json();
      const dataEstado = await respEstado.json();

      setProducto(dataProducto?.rows?.[0]);
      setEstadoDemanda(dataEstado?.rows?.[0]);
    } catch (error) {
      console.error(error);
      setDemanda(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDemandaDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandaId]);

  const verPropuestas = () => {
    navigate("/propuestas_recibidas", {
      state: {
        IdDemanda: demanda.IdDemanda,
        Producto: producto?.Name,
      },
    });
  };

  const fechaVigencia = demanda?.FechaLimite
    ? demanda.FechaLimite.split("T")[0]
    : "Sin fecha";

  const cantidadRestante =
    Number(demanda?.Maximo || 0) - Number(demanda?.ActualProductos || 0);

  const faltaParaMinimo =
    Number(demanda?.Minimo || 0) - Number(demanda?.ActualProductos || 0);

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
              <b>{producto?.Name || "Detalle de demanda"}</b>
            </p>

            <div style={{ marginLeft: "auto" }}>
              <EtiquetaDemanda
                estado={estadoDemanda?.Descripcion || "En curso"}
              />
            </div>
          </div>

          <hr className="hrGeneral" />

          {loading && <p className="paragraph">Cargando demanda...</p>}

          {!loading && !demanda && (
            <p className="paragraph">
              No se encontró la demanda seleccionada.
            </p>
          )}

          {!loading && demanda && (
            <>
              <div className="oferta-detalle__resumenBox">
                <div className="oferta-detalle__resumenBox__imgBox">
                  <img
                    src={producto?.UrlImg || fallbackImg}
                    alt={producto?.Name || "Producto sin imagen"}
                    className="oferta-detalle__resumenBox__imgBox__img"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                  />
                </div>

                <div className="oferta-detalle__resumenBox__descBox">
                  <p className="paragraph--mid">
                    <b>{producto?.Name}</b>
                  </p>

                  <p className="paragraph u-margin-top-small">
                    {demanda.Descripcion}
                  </p>
                </div>
              </div>

              <div className="oferta-detalle__infoGrid">
                <div className="oferta-detalle__infoGrid__item">
                  <p className="paragraph">
                    <b>Precio mínimo:</b> ${demanda.PrecioMinimo}
                  </p>
                </div>

                <div className="oferta-detalle__infoGrid__item">
                  <p className="paragraph">
                    <b>Precio máximo:</b> ${demanda.PrecioMaximo}
                  </p>
                </div>

                <div className="oferta-detalle__infoGrid__item">
                  <p className="paragraph">
                    <b>Actual:</b> {demanda.ActualProductos} / {demanda.Maximo}
                  </p>
                </div>

                <div className="oferta-detalle__infoGrid__item">
                  <p className="paragraph">
                    <b>Fecha vigencia:</b> {fechaVigencia}
                  </p>
                </div>
              </div>

              <div className="oferta-detalle__descripcionBox">
                <p className="paragraph">
                  <b>Unidades restantes:</b>{" "}
                  {cantidadRestante > 0 ? cantidadRestante : 0}
                </p>
              </div>

              <div className="oferta-detalle__descripcionBox">
                <p className="paragraph">
                  <b>Unidades restantes para completar el mínimo:</b>{" "}
                  {faltaParaMinimo > 0 ? faltaParaMinimo : 0}
                </p>
              </div>

              <div className="oferta-detalle__descripcionBox">
                <p className="paragraph">
                  <b>Progreso de la demanda:</b>
                </p>

                <ProgressBar
                  actualProductos={demanda.ActualProductos}
                  cantMax={demanda.Maximo}
                />
              </div>

              <div className="metodoPago__btnBox">
                <button
                  type="button"
                  className="btn btn--blue"
                  onClick={verPropuestas}
                >
                  Ver propuestas
                </button>

                <button
                  type="button"
                  className="btn btn--red"
                  onClick={() => navigate("/mis_demandas")}
                >
                  Volver
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="comp-main-container__divSepDer"></div>

      <div className="comp-main-container__derCont">
        <ContActividades />
      </div>
    </div>
  );
};