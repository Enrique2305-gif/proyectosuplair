import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { ContNavegar, DashboardCard } from "../components"

export const MainAdmPage = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    usuariosHoy: 0,
    reportes: 0,
    reportesSinLeer: 0,
    ofertas: 0,
    ofertasPorExpirar: 0,
    pagos: 0,
    registros: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch usuarios
        const usuariosResp = await fetch(`${apiUrl}/usuarios`);
        const usuariosData = await usuariosResp.json();
        const usuarios = usuariosData?.rows || [];

        // Calcular usuarios de hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const usuariosHoy = usuarios.filter(u => {
          const fechaCreacion = new Date(u.FechaCreacion);
          fechaCreacion.setHours(0, 0, 0, 0);
          return fechaCreacion.getTime() === hoy.getTime();
        }).length;

        // Fetch reportes
        const reportesResp = await fetch(`${apiUrl}/reportes`);
        const reportesData = await reportesResp.json();
        const reportes = reportesData?.rows || [];
        
        // Calcular reportes sin leer (asumiendo que tienen un campo Leido o Estado)
        const reportesSinLeer = reportes.filter(r => !r.Leido && r.IdEstado !== 2).length;

        // Fetch ofertas
        const ofertasResp = await fetch(`${apiUrl}/ofertas`);
        const ofertasData = await ofertasResp.json();
        const ofertas = ofertasData?.rows || [];
        
        // Calcular ofertas por expirar (próximas 7 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 7);
        const ofertasPorExpirar = ofertas.filter(o => {
          const fechaFin = new Date(o.FechaFin);
          return fechaFin <= fechaLimite && fechaFin >= new Date() && o.IdEstadosOferta === 1;
        }).length;

        // Fetch solicitudes de registro
        const solicitudesResp = await fetch(`${apiUrl}/solicitudRegistro`);
        const solicitudesData = await solicitudesResp.json();
        const solicitudes = solicitudesData?.rows || [];

        setStats({
          usuarios: usuarios.length,
          usuariosHoy: usuariosHoy,
          reportes: reportes.length,
          reportesSinLeer: reportesSinLeer,
          ofertas: ofertas.length,
          ofertasPorExpirar: ofertasPorExpirar,
          pagos: 15400, // Placeholder - ajustar según tu API
          registros: solicitudes.length
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Bienvenido Administrador!</h1>
        <hr className="hrGeneral"/>
        
        {loading ? (
          <div className="dashboardLoading">
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <div className="dashboardGrid">
            <DashboardCard
              title="Usuarios"
              value={stats.usuarios.toLocaleString()}
              subtitle="Usuarios"
              icon={<i className="fas fa-users"></i>}
              color="purple"
              footerText={stats.usuariosHoy > 0 ? `+${stats.usuariosHoy} hoy` : "Sin nuevos usuarios hoy"}
              footerColor="green"
            />
            
            <DashboardCard
              title="Reportes"
              value={stats.reportes}
              subtitle="Reportes"
              icon={<i className="fas fa-chart-line"></i>}
              color="purple"
              footerText={stats.reportesSinLeer > 0 ? `+${stats.reportesSinLeer} sin leer` : "Todos leídos"}
              footerColor={stats.reportesSinLeer > 0 ? "green" : "default"}
            />
            
            <DashboardCard
              title="Ofertas"
              value={stats.ofertas}
              subtitle="Ofertas"
              icon={<i className="fas fa-tags"></i>}
              color="purple"
              footerText={stats.ofertasPorExpirar > 0 ? `${stats.ofertasPorExpirar} por expirar` : "Sin ofertas por expirar"}
              footerColor={stats.ofertasPorExpirar > 0 ? "yellow" : "default"}
            />
            
            <DashboardCard
              title="Pagos"
              value={`$${stats.pagos.toLocaleString()}`}
              subtitle="Pendientes"
              icon={<i className="fas fa-credit-card"></i>}
              color="purple"
              footerText="Pendientes"
              footerColor="green"
            />
            
            <DashboardCard
              title="Registros"
              value="Audit Log"
              subtitle="Audit Log"
              icon={<i className="fas fa-file-alt"></i>}
              color="purple"
              footerText="Reciente"
              footerColor="default"
            />
          </div>
        )}
      </div>
    </div>
  )
}
