import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PagoExito = ({tipoPago, setShowPagoExito}) => {

  const [pagoNombre, setPagoNombre] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    tipoPago === "pago_reserva" ? setPagoNombre("Reserva") : setPagoNombre("Anticipado");
  }, [tipoPago])
  

  const onClickAceptar = () => {
    setShowPagoExito(false);
    navigate("/comprador",{
      replace: true,
    })
  }

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="metodoPago__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <p className="paragraph u-margin-top-mid">El pago de tipo {pagoNombre} se ha realizado con éxito!</p>
        <p className="paragraph u-margin-top-mid">Se ha unido correctamente a la oferta</p>
        <div className="metodoPago__btnBox u-margin-top-mid">
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
