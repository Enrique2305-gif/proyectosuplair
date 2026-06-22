import { Navigate, Route, Routes } from "react-router-dom";
import  NavbarProv  from "../components/NavbarProv";
import { PerfilProveedor } from "../../compradores/pages/PerfilProveedor";
import {
  CrearOferta,
  HistorialOfertasPageProv,
  ListDemandas,
  PanelPrincipalProv,
  MainProvPage,
  NotificacionesProv,
  OfertaDetalleProv,
  ProdByCatPageProv,
  SearchPageProv,
  SubirProducto,
  DemandaDetalleProv,
  VentaIndDetalle,
  CrearPropuesta
} from "../pages";
import {
  OfeCanPageProv,
  OfePenPageProv,
  OrdCompPageProv,
  OrdConfPageProv,
  OrdFinPageProv,
} from "../pages/menu_pages";

import { MiPerfil } from "../pages/MiPerfil";
import { useContext } from "react";
import { AuthContext } from "../../auth";
import { useSessionTimeout } from "../../hooks";

export const ProvRoutes = () => {
  const { logout } = useContext(AuthContext);
  useSessionTimeout({ logout, minutes: 60 });

  return (
    <>
      <NavbarProv />
      <div>
        <Routes>
          <Route index element={<Navigate to="/proveedor" replace />} />
          <Route path="/" element={<Navigate to="/proveedor" replace />} />
          <Route path="proveedor" element={<PanelPrincipalProv  />} />
          <Route path="categoria" element={<ProdByCatPageProv />} />
          <Route path="perfil_proveedor" element={<PerfilProveedor />} />
          <Route path="mis_ofertas" element={<MainProvPage />} />
          <Route path="mi_oferta/:ofertaId" element={<OfertaDetalleProv />} />
          <Route path="notificaciones" element={<NotificacionesProv />} />
          <Route
            path="historial_ofertas"
            element={<HistorialOfertasPageProv />}
          />
          <Route path="search" element={<SearchPageProv />} />
          <Route path="subir_producto" element={<SubirProducto />} />
          <Route path="crear_nueva_oferta" element={<CrearOferta />} />
          <Route
            path="venta_individual/:idCompra"
            element={<VentaIndDetalle />}
          />
          <Route path="ofertas_pendientes" element={<OfePenPageProv />} />
          <Route path="ofertas_canceladas" element={<OfeCanPageProv />} />
          <Route path="ordenes_compra" element={<OrdCompPageProv />} />
          <Route path="ordenes_por_confirmar" element={<OrdConfPageProv />} />
          <Route path="ordenes_finalizadas" element={<OrdFinPageProv  />} />
          <Route path="mi_perfil" element={<MiPerfil />} />
          <Route path="demandas" element={<ListDemandas />} />
          <Route path="demanda/:demandaId" element={<DemandaDetalleProv />} />
          <Route path="crear_propuesta" element={<CrearPropuesta />} />
          <Route path="/*" element={<Navigate to="/proveedor" replace />} />
        </Routes>
      </div>
    </>
  );
};
