import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { apiUrl } from "../../apiUrl";


export const ContBotonPago = ({price = 0, userId, onPaymentSuccess, onDescuentoChange}) => {
  const [descuentos, setDescuentos] = useState([]);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [saldoEstrellas, setSaldoEstrellas] = useState(0);
  const [totalFinal, setTotalFinal] = useState(parseFloat(price));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDescuentos();
    if (userId) {
      fetchSaldoEstrellas();
    }
  // Las funciones de fetch se mantienen aquí para no cambiar la integración con la API.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    // Solo resetear si no hay descuento seleccionado
    if (!descuentoSeleccionado) {
      setTotalFinal(parseFloat(price));
    }
  }, [price, descuentoSeleccionado]);

  const fetchDescuentos = async () => {
    try {
      const resp = await fetch(`${apiUrl}/recompensas/canjes`);
      const data = await resp.json();
      
      console.log("Datos de descuentos:", data); // Para depurar en consola

      // CORRECCIÓN: El backend envía un array, no un objeto con .canjes
      if (Array.isArray(data)) {
         setDescuentos(data);
      } else if (data.canjes) {
         // Por si acaso cambias el backend luego
         setDescuentos(data.canjes);
      } else if (data.data) {
         // Otro formato común
         setDescuentos(data.data);
      }

    } catch (error) {
      console.error('Error al cargar descuentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaldoEstrellas = async () => {
    try {
      const resp = await fetch(`${apiUrl}/recompensas/saldo/${userId}`);
      const data = await resp.json();
      if (data.ok) {
        setSaldoEstrellas(data.balance);
      }
    } catch (error) {
      console.error('Error al cargar saldo:', error);
    }
  };

  const handleDescuentoChange = (e) => {
    const idOpcion = e.target.value;
    
    if (!idOpcion || idOpcion === "") {
      setDescuentoSeleccionado(null);
      const precioOriginal = parseFloat(price);
      setTotalFinal(precioOriginal);
      
      // Notificar al componente padre que no hay descuento
      if (onDescuentoChange) {
        onDescuentoChange({
          IdOpcionDescuento: null,
          totalOriginal: precioOriginal,
          totalFinal: precioOriginal,
          descuentoAplicado: null
        });
      }
      return;
    }

    const descuento = descuentos.find(d => d.IdOpcion === parseInt(idOpcion));
    
    if (descuento) {
      // Verificar si tiene suficientes estrellas
      if (saldoEstrellas < descuento.CostoEstrellas) {
        alert(`No tienes suficientes estrellas. Necesitas ${descuento.CostoEstrellas} estrellas pero solo tienes ${saldoEstrellas}.`);
        e.target.value = "";
        return;
      }

      setDescuentoSeleccionado(descuento);
      const precioOriginal = parseFloat(price);
      const descuentoAplicado = precioOriginal * (descuento.Porcentaje / 100);
      const nuevoTotal = precioOriginal - descuentoAplicado;
      // Redondear a 2 decimales para transacciones comerciales
      const totalFinalNumerico = Math.round(nuevoTotal * 100) / 100;
      
      setTotalFinal(totalFinalNumerico);
      
      // Notificar al componente padre sobre el cambio de descuento
      if (onDescuentoChange) {
        onDescuentoChange({
          IdOpcionDescuento: descuento.IdOpcion,
          totalOriginal: precioOriginal,
          totalFinal: totalFinalNumerico,
          descuentoAplicado: descuento
        });
      }
    }
  };

  const createOrder = (data, actions) => {
    // Asegurar que el valor sea un string con 2 decimales para PayPal
    const valorPago = parseFloat(totalFinal).toFixed(2);
    console.log("Creando orden de PayPal con valor:", valorPago);
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: valorPago
          }
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(() => {
      handlePay();
    });
  };

  function handlePay() {
    console.log("=== HANDLE PAY - ContBotonPago ===");
    console.log("Price original:", price, "Tipo:", typeof price);
    console.log("Total Final:", totalFinal, "Tipo:", typeof totalFinal);
    console.log("Descuento seleccionado:", descuentoSeleccionado);
    
    // Asegurar que los valores sean números con 2 decimales
    const totalFinalNumerico = Math.round((typeof totalFinal === 'number' ? totalFinal : parseFloat(totalFinal)) * 100) / 100;
    const precioOriginalNumerico = Math.round((typeof price === 'number' ? price : parseFloat(price)) * 100) / 100;
    
    console.log("Total Final Numérico:", totalFinalNumerico.toFixed(2));
    console.log("Precio Original Numérico:", precioOriginalNumerico.toFixed(2));
    
    alert("el pago ha sido exitoso desde la web");
    
    // Llamar al callback con el ID del descuento seleccionado
    if (onPaymentSuccess) {
      const paymentData = {
        IdOpcionDescuento: descuentoSeleccionado ? descuentoSeleccionado.IdOpcion : null,
        totalOriginal: precioOriginalNumerico,
        totalFinal: totalFinalNumerico,
        descuentoAplicado: descuentoSeleccionado
      };
      
      console.log("=== PAYMENT DATA A ENVIAR ===");
      console.log(JSON.stringify(paymentData, null, 2));
      onPaymentSuccess(paymentData);
    }
  }

  // Importa PayPalButton solo en un entorno de navegador
  let PayPalButton = null;
  if (typeof window !== "undefined" && window.paypal) {
    PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
  }

  return (
    <center className="contBotonPago">
        <div className="contBotonPago__saldoBox">
          <p className="paragraph"><strong>Tu saldo de estrellas:</strong> {saldoEstrellas}</p>
        </div>

        {!loading && descuentos.length > 0 && (
          <div className="contBotonPago__descuentoSelector">
            <label htmlFor="descuento" className="paragraph">
              <strong>Selecciona un descuento:</strong>
            </label>
            <select 
              id="descuento" 
              onChange={handleDescuentoChange}
              className="contBotonPago__descuentoSelector__select"
            >
              <option value="">Sin descuento</option>
              {descuentos.map((desc) => (
                <option 
                  key={desc.IdOpcion} 
                  value={desc.IdOpcion}
                  disabled={saldoEstrellas < desc.CostoEstrellas}
                >
                  {desc.Nombre} - {desc.Porcentaje}% de descuento 
                  ({desc.CostoEstrellas} estrellas)
                  {saldoEstrellas < desc.CostoEstrellas && " - Insuficientes estrellas"}
                </option>
              ))}
            </select>
          </div>
        )}

        {descuentoSeleccionado && (
          <div className="contBotonPago__descuentoInfo">
            <p className="paragraph">
              <strong>Descuento aplicado:</strong> {descuentoSeleccionado.Nombre} ({descuentoSeleccionado.Porcentaje}%)
            </p>
            <p className="paragraph">
              <strong>Ahorro:</strong> ${(parseFloat(price) - totalFinal).toFixed(2)}
            </p>
          </div>
        )}

        <div className="contBotonPago__totalCard">
          <div className="contBotonPago__totalCard__precio">
            ${totalFinal.toFixed(2)}
          </div>
          <div className="contBotonPago__totalCard__label">
            Total a pagar
          </div>
          {descuentoSeleccionado && (
            <div className="contBotonPago__totalCard__original">
              Precio original: ${parseFloat(price).toFixed(2)}
            </div>
          )}
        </div>
        {PayPalButton && (
          <div className="contBotonPago__paypalContainer">
            <PayPalButton
              createOrder={(data, actions) => createOrder(data, actions)}
              onApprove={(data, actions) => onApprove(data, actions)}
            />
          </div>
        )}
    </center>
  );
}