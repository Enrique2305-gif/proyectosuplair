import { useNavigate } from "react-router-dom";

export const ReporteCard = ({reporte}) => {

  const navigate = useNavigate();

  const onClickReporte = () => {
    navigate(`/reporte/${reporte.IdReporte}`);
  }
  
  return (
    <div 
    className="notificacionCard"
    onClick={onClickReporte}
  >
    <span className="material-symbols-rounded icon--md--2 notificacionCard__icon--red">
      report
    </span>
    <div className="u-margin-left-small">
      <p className="paragraph--mid--2">Motivo: {reporte?.Motivo}</p>
      <p className="paragraph">Comentario: {reporte?.Descripcion}</p>
      <p className="paragraph">Fecha de reporte: {(reporte?.FechaCrea)?.split("T")[0]}</p>
    </div>
  </div>
  )
}
