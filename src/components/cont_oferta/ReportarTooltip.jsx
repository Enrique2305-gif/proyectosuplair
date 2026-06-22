import { useEffect, useRef } from "react"

export const ReportarTooltip = ({esOferta, onClickOutside, setShowVentanaReportar}) => {
  
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickOutside])

  const onClickReportar = () => {
    setShowVentanaReportar(true);
  }
  
  return (
    <div 
      ref={ref} 
      className="oferta-card-reportarTooltip"
      onClick={onClickReportar}
    >
      <p className="paragraph">{esOferta ? "Reportar oferta" : "Reportar compra"}</p>
    </div>
  )
}
