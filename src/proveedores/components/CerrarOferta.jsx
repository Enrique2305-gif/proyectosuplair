import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";

export const CerrarOferta = ({oferta, setShowCerrarOferta, setShowCierreExitoso}) => {

  const [comprasInd, setComprasInd] = useState();
  const [seHaTerminado, setSeHaTerminado] = useState(false);

  const cerrarOferta = async() => {
  const body = { 
    IdOferta: oferta.IdOferta,
    IdEstadosOferta: 2 // Por confirmar cierre
  };

  const resp = await fetch(`${apiUrl}/cambiarofertaestado`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  console.log(data);
};

  const getComprasIndByOferta = async() => {
    const resp = await fetch(`${apiUrl}/compras?idOferta=${oferta?.IdOferta}`);
    const data = await resp.json();
    const {rows: compras} = !!data && data;
    setComprasInd(compras);
  }

  const cambiarAVerificandoPagosCompras = async () => {
  await Promise.all(
    comprasInd?.map(async (compra) => {
      const body = { 
        IdCompra: compra.IdCompra,
        IdEstado: 3, // Verificando pagos
        PagadoAProveedor: false,
      };

      const resp = await fetch(`${apiUrl}/compras`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      console.log(data);
    }) || []
  );

  setSeHaTerminado(true);
};

  const efectuarPagoPaypal = (compra) => {
    // ---- aqui es donde se simula que se ha pagado con paypal a traves de reserva
    // ---- El proveedor se encarga de confirmar el pago recibido
    // const body = { 
    //   IdCompra: compra.IdCompra,
    //   IdEstado: 4, //Id Estado Cerrado DB
    //   PagadoAProveedor: true,
    // }
    // const resp = await fetch(`${apiUrl}/compras`, {
    //   method: 'PATCH',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(body)
    // });
    // const data = await resp.json()
    // console.log(!!data && "cambiando estado compra a por despachar");
    console.log(`Pagado con paypal la compra con id: ${compra.IdCompra}`)
  }

  //en este caso, también se le crea al proveedor el pago de esa compra

  const verificarCompraMetodosPago = () => {
    comprasInd.forEach(compra => {
      compra.MetodoPago === "reserva" 
      && 
        setTimeout(() => {
          efectuarPagoPaypal(compra);
        }, 5000)
    })
  }

  useEffect(() => {
  if (comprasInd) {
    cambiarAVerificandoPagosCompras();
  }
  // eslint-disable-next-line
}, [comprasInd]);

  useEffect(() => {
    if(seHaTerminado){
      setShowCierreExitoso(true);
      setShowCerrarOferta(false);
      verificarCompraMetodosPago();

    }
    // eslint-disable-next-line
  }, [seHaTerminado])
  
  const onClickConfirmarCierre = () => {
    cerrarOferta()
      .then(res => getComprasIndByOferta());
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
          Su oferta ha alcanzado <b>la mínima cantidad de productos a vender</b>, sin embargo, la oferta todavía <b>no ha llegado a su fecha de vigencia</b>. <br/>Si está seguro de cerrar su oferta, de click en <b>Cerrar oferta</b>.
        </p>
      </div>
      <div className="metodoPago__btnBox">
        <button 
          type="button"
          onClick={onClickConfirmarCierre}
          className="btn btn--blue"
        >Cerrar oferta</button>
      </div>
    </div>
  </div>
  )
}
