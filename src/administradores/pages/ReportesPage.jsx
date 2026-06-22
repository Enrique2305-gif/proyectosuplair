import { useEffect } from "react";
import { useState } from "react";
import { apiUrl } from "../../apiUrl";
import { BuscadorAdm, ContNavegar, ReporteCard} from "../components"

export const ReportesPage = () => {

  const [reportes, setReportes] = useState([]);

  const getReportes = async() => {
    const resp = await fetch(`${apiUrl}/reportes`);
    const data = await resp.json();
    const {rows: reportes} = !!data && data;
    setReportes(reportes);
  }

  useEffect(() => {
    getReportes();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showEmptyArray = reportes?.length === 0;

  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Reportes</h1>
        <hr className="hrGeneral"/>
        <div>
          <div className="admBusquedaBox">
            <BuscadorAdm tipoBusqueda={"reportes"}/>
          </div>
          <div className="admPrincipalContainer">
            {showEmptyArray
            ? <p className="paragraph"> Por el momento no hay reportes registrados</p>
            : reportes.map((reporte) => <ReporteCard reporte={reporte} key={reporte.IdReporte}/>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
