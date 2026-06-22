import { useContext, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { ContBotonPago } from "../../components";

export const CompraReserva = ({
  oferta,
  costoTotal,
  setShowPagoReserva,
  setShowPagoExito,
  setShowErrorPago,
  unidadesPetUsuario,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [pagoExitoso] = useState(true);
  const [datosDescuento, setDatosDescuento] = useState(null);

  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const actualizarOferta = async () => {
    const body = {
      IdOferta: oferta.IdOferta,
      NuevoActualProductos:
        parseInt(oferta.ActualProductos) + parseInt(unidadesPetUsuario),
    };
    const resp = await fetch(`${apiUrl}/ofertas`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    console.log(!!data && "exito");
  };

  const crearCompraIndividual = async (paymentData = {}) => {
    // Determinar el total correcto: usar totalFinal si existe, sino costoTotal
    const totalAPagar = paymentData.totalFinal !== undefined && paymentData.totalFinal !== null 
      ? Math.round(paymentData.totalFinal * 100) / 100
      : Math.round(costoTotal * 100) / 100;

    console.log("=== CREANDO COMPRA INDIVIDUAL (RESERVA) ===");
    console.log("Payment Data recibido:", paymentData);
    console.log("Costo Total original:", costoTotal.toFixed(2));
    console.log("Total a guardar en BD:", totalAPagar.toFixed(2));
    console.log("ID Opción Descuento:", paymentData.IdOpcionDescuento);

    const body = {
      IdComprador: user.IdUsuario,
      IdProveedor: oferta.IdProveedor,
      IdOferta: oferta.IdOferta,
      Cantidad: unidadesPetUsuario,
      Total: totalAPagar,
      Descripcion: "",
      Observacion: "",
      IdEstado: oferta.IdEstadosOferta,
      MetodoPago: "reserva",
      PagadoAProveedor: false,
      TipoCompra: "normal",
      IdOpcionDescuento: paymentData.IdOpcionDescuento || null,
    };

    console.log("Body a enviar:", body);

    const resp = await fetch(`${apiUrl}/compras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    console.log("Respuesta del servidor:", data);
  };

  //este metodo debe ser asincrono
  const efectuarPagoReserva = (paymentData = {}) => {
    // aqui va la implementacion con paypal para hacer las reservas
    // debe guardarse en la db el registro del pago, para luego de cerrar la oferta..
    // efectuar el pago a los proveedores
    return new Promise((resolve, reject) => {
      //TODO: metodo para setear el pago existoso
      if (pagoExitoso) {
        crearCompraIndividual(paymentData);
        actualizarOferta();
        setShowPagoExito(true);
        setShowPagoReserva(false);
        resolve(true);
      } else {
        setShowErrorPago(true);
        setShowPagoReserva(false);
        reject(false);
      }
    });
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log("=== HANDLE PAYMENT SUCCESS (RESERVA) ===");
    console.log("Payment Data completo:", paymentData);
    console.log("Total Final:", paymentData.totalFinal);
    console.log("Total Original:", paymentData.totalOriginal);
    console.log("Descuento Aplicado:", paymentData.descuentoAplicado);
    
    efectuarPagoReserva(paymentData)
      .then((res) => console.log("pago con exito"))
      .catch((res) => console.log(res));
  };

  const onSubmitPago = () => {
    console.log("=== BOTON CONTINUAR PRESIONADO (RESERVA) ===");
    console.log("Datos de descuento guardados:", datosDescuento);
    
    // Si hay datos de descuento guardados, usarlos; sino, pasar objeto vacío
    efectuarPagoReserva(datosDescuento || {})
      .then((res) => console.log("pago con exito"))
      .catch((res) => console.log(res));
  };

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="metodoPago__ventana animate__animated animate__slideInDown">
        <div className="metodoPago__barraSup"></div>
        <p className="paragraph u-margin-top-small">
          <b>Efectuando Pago con Reserva</b>
        </p>
        <div className="u-margin-top-small"></div>
        <ContBotonPago 
          price={costoTotal.toFixed(2)} 
          userId={user.IdUsuario}
          onPaymentSuccess={handlePaymentSuccess}
          onDescuentoChange={setDatosDescuento}
        />
        <div className="metodoPago__btnBox">
          <button
            type="button"
            onClick={() => setShowPagoReserva(false)}
            className="btn btn--red"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmitPago}
            className="btn btn--blue"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
