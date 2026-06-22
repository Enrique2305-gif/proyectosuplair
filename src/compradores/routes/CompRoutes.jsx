import { Navigate, Route, Routes } from "react-router-dom";
import  NavbarComp  from "../components/NavbarComp";
import {
  SubirProductoComp,
  CrearDemanda,
  CompraIndividualPage,
  HistorialOfertasPage,
  MainCompPage,
  MiPerfil,
  Notificaciones,
  OfeCanPage,
  OfePenPage,
  DemandaDetalleComp,
  OfertaDetalle,
  OrdCompPage,
  OrdConfPage,
  OrdFinPage,
  ProdByCatPage,
  SearchPage,
  MisDemandas,
  MisDemandasAprobadas,
  PropuestasRecibidas,
} from "../pages";
import { PerfilProveedor } from "../pages/PerfilProveedor";
import { useContext } from "react";
import { AuthContext } from "../../auth";
import { useSessionTimeout } from "../../hooks";

export const CompRoutes = () => {
  const { logout } = useContext(AuthContext);
  useSessionTimeout({ logout, minutes: 60 });

  return (
    <>
      <NavbarComp />
      <div>
        <Routes>
          <Route path="comprador" element={<MainCompPage />} />
          <Route path="oferta/:ofertaId" element={<OfertaDetalle />} />
          <Route path="subir_producto" element={<SubirProductoComp />} />
          <Route path="crear_demanda" element={<CrearDemanda />} />
          <Route path="historial_ofertas" element={<HistorialOfertasPage />} />
          <Route path="categoria" element={<ProdByCatPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notificaciones" element={<Notificaciones />} />
          <Route path="perfil_proveedor" element={<PerfilProveedor />} />
          <Route
            path="oferta_individual/:IdCompra"
            element={<CompraIndividualPage />}
          />
          <Route path="ofertas_pendientes" element={<OfePenPage />} />
          <Route path="ofertas_canceladas" element={<OfeCanPage />} />
          <Route path="ordenes_compra" element={<OrdCompPage />} />
          <Route path="ordenes_por_confirmar" element={<OrdConfPage />} />
          <Route path="ordenes_finalizadas" element={<OrdFinPage />} />
          <Route path="mi_perfil" element={<MiPerfil />} />
          <Route path="mis_demandas" element={<MisDemandas/>}/>
          <Route path="mi_demanda/:demandaId" element={<DemandaDetalleComp />} />
          <Route path="demandas_aprobadas" element={<MisDemandasAprobadas/>}/>
          <Route path="propuestas_recibidas" element={<PropuestasRecibidas/>}/>
          <Route path="/*" element={<Navigate to="comprador" />} />
        </Routes>
      </div>
    </>
  );
};
