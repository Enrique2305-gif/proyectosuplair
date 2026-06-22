import { apiUrl } from "../../apiUrl";

export const ConfirmarPagoProv = ({compra, setShowConfirmarPagoProv, setShowPagoRecibidoExitoso}) => {

  const onConfirmarPago = async() => {
    const body = { 
      IdCompra: compra.IdCompra,
      IdEstado: 4, //Id Estado Cerrado DB
      PagadoAProveedor: true,
    }
    const resp = await fetch(`${apiUrl}/compras`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(!!data && "cambiando estado compra a por despachar");
    setShowConfirmarPagoProv(false);
    setShowPagoRecibidoExitoso(true);
  }

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
    <div className="accionWarning__ventana animate__animated animate__slideInDown">
      <div className="metodoPago__barraSup"></div>
      <div className="accionWarning__ventana__textoBox">
        <span className="material-symbols-rounded accionWarning__ventana__textoBox__iconWarning">
          warning
        </span>
        <p className="paragraph" align="center">
          ¿Confirmar que ha recibido el correspondiente pago de la venta?
        </p>
      </div>
      <div className="metodoPago__btnBox">
        <button 
          type="button"
          onClick={onConfirmarPago}
          className="btn btn--blue"
        >Confirmar</button>
      </div>
    </div>
  </div>
  )
}
