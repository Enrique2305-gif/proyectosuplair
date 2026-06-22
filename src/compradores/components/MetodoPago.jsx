import { useForm } from "../../hooks";

export const MetodoPago = ({setShowMetodoPago, setShowPagoReserva, setShowPagoAnticipado, setTipoPago}) => {

  const PayPalIcon = "https://1000marcas.net/wp-content/uploads/2019/12/logo-Paypal.png";

  const {metodo_pago, onInputChange} = useForm({acepta_terminos: false});

  const onMetodoSubmit = (e) =>{
    e.preventDefault();
    if (metodo_pago === "pago_anticipado"){
      setTipoPago(metodo_pago);
      setShowPagoAnticipado(true);
      setShowMetodoPago(false);
    }
    else if (metodo_pago === "pago_reserva"){
      setTipoPago(metodo_pago);
      setShowPagoReserva(true);
      setShowMetodoPago(false);
    }
    else {
      console.log("seleccione metodo de pago")
    }
  }

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="metodoPago__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        
        <form onSubmit={onMetodoSubmit} className="metodoPago__form">
          <p className="paragraph">Seleccione método de pago: </p>
          <img src={PayPalIcon} alt="PayPal" className="metodoPago__paypalIcon" />
          <div className="metodoPago__form__inputBox">
            <div className="metodoPago__form__inputBox__inputInd">
              <input
                type="radio"
                id="pago_anticipado"
                value="pago_anticipado"
                name="metodo_pago"
                onChange={onInputChange}
              />
              <label 
                htmlFor="pago_anticipado" 
                className="paragraph"
              >Pago anticipado</label>
            </div>
            <div className="metodoPago__form__inputBox__inputInd">
              <input
                type="radio"
                id="pago_reserva"
                value="pago_reserva"
                name="metodo_pago"
                onChange={onInputChange}
              />
              <label 
                htmlFor="pago_reserva"
                className="paragraph"
              >Reserva</label>
            </div> 
          </div> 
          <div className="metodoPago__btnBox">
            <button 
              type="button"
              onClick={() => setShowMetodoPago(false)}
              className="btn btn--red"
            >Cancelar</button>
            <button 
              type="submit"
              className="btn btn--blue"
            >Continuar</button>
          </div>  
        </form>
      </div>
    </div>
  )
}
