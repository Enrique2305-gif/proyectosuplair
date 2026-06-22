import { apiUrl } from "../../apiUrl";

export const ConfirmarProdRecibido = ({compra, setShowConfirmarProdRecibido, setShowRecibidoExitoso}) => {

  //const [enviarNotificaciones, setEnviarNotificaciones] = useState(false);

  const onConfirmarProdRecibido = async() => {
    const body = { 
      IdCompra: compra.IdCompra,
      IdEstado: 9, //Id Estado DB
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
    setShowConfirmarProdRecibido(false);
    setShowRecibidoExitoso(true);
    //setEnviarNotificaciones(true);
    
  }

  /*const sendNotifications = async() => {
    //get usuarios de la compra
    console.log("ejecutando estooooo")
    const resp = await fetch(`${apiUrl}/enviarNotificacionCompra?idCompra=${compra.IdCompra}`);
    const data = await resp.json()
    console.log(!!data && "notificaciones enviadas desde el back!")
  }*/

  // useEffect(() => {
  //   if(enviarNotificaciones) {
  //     sendNotifications()
  //     .then((res) => {
  //       setShowConfirmarProdRecibido(false);
  //       setShowRecibidoExitoso(true);
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [enviarNotificaciones])
  

  return (
    <div className="resumenProducto animate__animated animate__fadeIn">
    <div className="accionWarning__ventana animate__animated animate__slideInDown">
      <div className="metodoPago__barraSup"></div>
      <div className="accionWarning__ventana__textoBox">
        <span className="material-symbols-rounded accionWarning__ventana__textoBox__iconWarning">
          warning
        </span>
        <p className="paragraph" align="center">
          ¿Confirmar que ha recibido el producto?
        </p>
      </div>
      <div className="metodoPago__btnBox">
        <button 
          type="button"
          onClick={onConfirmarProdRecibido}
          className="btn btn--blue"
        >Confirmar</button>
      </div>
    </div>
  </div>
  )
}
