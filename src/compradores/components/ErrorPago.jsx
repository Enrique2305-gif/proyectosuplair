import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ErrorPago = ({tipoPago, setShowErrorPago}) => {

  const navigate = useNavigate();
  const [pagoNombre, setPagoNombre] = useState("");

  useEffect(() => {
    tipoPago === "pago_reserva" ? setPagoNombre("Reserva") : setPagoNombre("Anticipado");
  }, [tipoPago])

  const onClickAceptar = () => {
    setShowErrorPago(false);
    navigate("/comprador",{
      replace: true,
    })
  }

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="metodoPago__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <p className="paragraph">Lo sentimos, hubo un error al momento de procesar el pago de tipo {pagoNombre}</p>
        <p className="paragraph">Intenta de nuevo más tarde</p>
        <div className="metodoPago__btnBox">
          <button 
            type="button"
            onClick={onClickAceptar}
            className="btn btn--blue"
          >Aceptar</button>
        </div>
      </div>
    </div>
  )
}
