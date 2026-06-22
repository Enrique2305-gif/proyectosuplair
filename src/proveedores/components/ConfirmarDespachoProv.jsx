import { apiUrl } from "../../apiUrl";

export const ConfirmarDespachoProv = ({compra, setShowConfirmarDespachoProv, setShowDespachoExitoso}) => {

  const onConfirmarDespacho = async() => {
    const body = { 
      IdCompra: compra.IdCompra,
      IdEstado: 5, //Id Estado Cerrado DB
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
    console.log(!!data && "cambiando estado compra a despachado");
    setShowConfirmarDespachoProv(false);
    setShowDespachoExitoso(true);
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
          ¿Confirmar el despacho del producto?
        </p>
      </div>
      <div className="metodoPago__btnBox">
        <button 
          type="button"
          onClick={onConfirmarDespacho}
          className="btn btn--blue"
        >Confirmar</button>
      </div>
    </div>
  </div>
  )
}
