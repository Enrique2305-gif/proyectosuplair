import { BuscadorAdm } from "../components"
import { ContNavegar } from "../components/ContNavegar"

export const PagosPage = () => {
  return (
    <div className="admContainer">
      <div className="adm-main-container__izqCont">
        <ContNavegar/>
      </div>
      <div className="admMainContainer">
        <h1>Pagos</h1>
        <hr className="hrGeneral"/>
        <div>
          <div className="admBusquedaBox">
            <BuscadorAdm tipoBusqueda={"pagos"}/>
          </div>
          <div className="admPrincipalContainer">
            <p className="paragraph"> Por el momento no hay pagos registrados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
