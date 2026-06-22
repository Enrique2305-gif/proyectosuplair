import { useEffect, useState, useContext } from "react";
import { apiUrl } from "../../apiUrl";
import { useForm } from "../../hooks";
import { AuthContext } from "../../auth";

export const CompraInstantanea = ({
  setShowCompraInstantanea,
  setUnidadesPetUsuario,
  oferta,
  setShowInstantaneaExitosa,
  costoTotal,
  setCostoTotal,
  producto,
  unidadesPetUsuario,
}) => {
  const { unidadesUser, onInputChange } = useForm({ unidadesUser: 0 });

  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [proveedor, setProveedor] = useState({});

  // --- NUEVOS ESTADOS PARA DESCUENTOS ---
  const [descuentos, setDescuentos] = useState([]);
  const [saldoEstrellas, setSaldoEstrellas] = useState(0);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);

  // --- CARGA DE DATOS INICIALES ---
  useEffect(() => {
    // 1. Obtener datos del proveedor (Lógica original)
    if (oferta?.IdProveedor) {
      getProveedor();
    }

    // 2. Obtener lista de descuentos disponibles
    const fetchDescuentos = async () => {
      try {
        const resp = await fetch(`${apiUrl}/recompensas/canjes`);
        const data = await resp.json();
        
        console.log("Descuentos cargados:", data); // Para verificar

        // CORRECCIÓN:
        // Verificamos si existe la propiedad .canjes (que es el array)
        if (data.canjes && Array.isArray(data.canjes)) {
           setDescuentos(data.canjes);
        } 
        // Por si acaso el backend cambia y envía el array directo
        else if (Array.isArray(data)) {
           setDescuentos(data);
        }

      } catch (error) {
        console.error("Error cargando descuentos:", error);
      }
    };

    // 3. Obtener saldo de estrellas del usuario
    const fetchSaldo = async () => {
      try {
        const resp = await fetch(`${apiUrl}/recompensas/saldo/${user.IdUsuario}`);
        const data = await resp.json();
        if (data.ok) setSaldoEstrellas(data.balance);
      } catch (error) {
        console.error("Error cargando saldo:", error);
      }
    };

    fetchDescuentos();
    if (user?.IdUsuario) fetchSaldo();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oferta, user]);

  // --- CÁLCULO DEL TOTAL (CON DESCUENTO) ---
  useEffect(() => {
    let total = parseInt(unidadesUser) * oferta?.ValorUInstantaneo;
    
    if (isNaN(total)) total = 0;

    if (descuentoSeleccionado) {
        const porcentaje = descuentoSeleccionado.PorcentajeDescuento || descuentoSeleccionado.Porcentaje;
        
        // --- CORRECCIÓN AQUÍ ---
        // Debes dividir para 100 para convertir el 5 en 0.05
        const ahorro = total * (porcentaje / 100); 
        
        total = total - ahorro;
    }

    setCostoTotal(total);
  }, [unidadesUser, oferta, descuentoSeleccionado, setCostoTotal]);


  const onCompraSubmit = (e) => {
    e.preventDefault();
    crearCompraIndividual();
    setUnidadesPetUsuario(unidadesUser);
    setShowInstantaneaExitosa(true);
    setShowCompraInstantanea(false);
    actualizarOferta();
  };

  const getProveedor = async () => {
    const resp = await fetch(
      `${apiUrl}/usuarios?idUsuario=${oferta.IdProveedor}`
    );
    const data = await resp.json();
    const { rows: proveedor } = !!data && data;
    setProveedor(proveedor[0]);
  };

  const actualizarOferta = async () => {
    const body = {
      IdOferta: oferta.IdOferta,
      NuevoActualProductos:
        parseInt(oferta.ActualProductos) + parseInt(unidadesUser),
    };
    await fetch(`${apiUrl}/ofertas`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const crearCompraIndividual = async () => {
    const body = {
      IdComprador: user.IdUsuario,
      IdProveedor: oferta.IdProveedor,
      IdOferta: oferta.IdOferta,
      Cantidad: unidadesUser, // Corregido: usar el estado local o el prop
      Total: costoTotal,
      Descripcion: "",
      Observacion: "",
      IdEstado: oferta.IdEstadosOferta,
      MetodoPago: "reserva",
      PagadoAProveedor: false,
      TipoCompra: "instantanea",
      // --- NUEVO: Enviar descuento ---
      IdOpcionDescuento: descuentoSeleccionado ? descuentoSeleccionado.IdOpcion : null
    };

    const resp = await fetch(`${apiUrl}/compras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    console.log(!!data && "exito compra");
  };

  return (
    <div className="metodoPago animate__animated animate__fadeIn">
      <div className="compraProducto animate__animated animate__slideInDown">
        <form onSubmit={onCompraSubmit}>
          <div className="compraProducto__box">
            <div className="explorarCat__title">
              <p className="paragraph--mid">
                <b>Unirse a la oferta</b>
              </p>
            </div>
            <hr className="hrGeneral" />
            
            {/* --- DETALLES DEL PRODUCTO --- */}
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <div className="oferta-detalle__productoBox__imgBox">
                <img
                  className="oferta-detalle__productoBox__imgBox__img"
                  src={
                    producto?.UrlImg === "no-img.jpeg"
                      ? "/no-img.jpeg"
                      : producto?.UrlImg
                  }
                  alt={producto?.Name}
                />
              </div>
              <div className="oferta-detalle__productoBox__desc">
                <div className="oferta-detalle__productoBox__desc__text">
                  <p className="paragraph">
                    <b>{producto?.Name}</b>
                  </p>
                  <p className="paragraph">
                    Precio unitario: {"$" + oferta?.ValorUInstantaneo}
                  </p>
                  <p className="paragraph">
                    Unidades disponibles:{" "}
                    {oferta?.Maximo - oferta?.ActualProductos}
                  </p>
                </div>
              </div>
            </div>

            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                <b>Proveedor: {proveedor?.Nombre}</b>
              </p>
            </div>
            <div className="oferta-detalle__productoBox u-margin-top-small">
              <p className="paragraph">
                Fecha de cierre: {oferta?.FechaLimite.split("T")[0]}
              </p>
            </div>

            {/* --- NUEVA SECCIÓN: SALDO Y DESCUENTOS --- */}
            <div className="oferta-detalle__productoBox u-margin-top-small" style={{backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px'}}>
               <p className="paragraph" style={{marginBottom: '5px'}}>
                 <span className="material-symbols-rounded" style={{verticalAlign: 'middle', color: '#f1c40f'}}>star</span>
                 <b> Tu saldo: {saldoEstrellas} Estrellas</b>
               </p>
               
               {descuentos && descuentos.length > 0 ? (
                 <select 
                    className="compraProducto__input paragraph"
                    style={{width: '100%', marginTop: '5px'}}
                    onChange={(e) => {
                        const id = parseInt(e.target.value);
                        if (!id) {
                            setDescuentoSeleccionado(null);
                            return;
                        }
                        const desc = descuentos.find(d => d.IdOpcion === id);
                        
                        // Validación de saldo
                        if (desc && saldoEstrellas < desc.CostoEstrellas) {
                            alert(`No tienes suficientes estrellas. Necesitas ${desc.CostoEstrellas}`);
                            e.target.value = ""; // Resetear select
                            setDescuentoSeleccionado(null);
                        } else {
                            setDescuentoSeleccionado(desc);
                        }
                    }}
                 >
                    <option value="">-- Sin Descuento --</option>
                    {descuentos.map(d => (
                        <option 
                            key={d.IdOpcion} 
                            value={d.IdOpcion}
                            disabled={saldoEstrellas < d.CostoEstrellas} // Visualmente deshabilitado
                        >
                            {d.Nombre} ({(d.PorcentajeDescuento || d.Porcentaje)}%) • {d.CostoEstrellas}⭐
                        </option>
                    ))}
                 </select>
               ) : (
                 <p className="paragraph--sm">Cargando descuentos...</p>
               )}
            </div>

            {/* --- INPUTS Y TOTAL --- */}
            <div className="oferta-detalle__productoBox__twoColumn">
              <div className="oferta-detalle__productoBox u-margin-top-small ">
                <input
                  type="number"
                  placeholder="Cantidad"
                  className="compraProducto__input paragraph"
                  name="unidadesUser"
                  autoComplete="off"
                  value={unidadesUser}
                  onChange={onInputChange}
                  min={1}
                  max={oferta?.Maximo - oferta?.ActualProductos}
                  required
                />
              </div>
              <div className="oferta-detalle__productoBox u-margin-top-small u-justify-center">
                <div style={{textAlign: 'right'}}>
                    {descuentoSeleccionado && (
                        <p className="paragraph--sm" style={{color: 'green'}}>
                            Descuento aplicado: -${(parseInt(unidadesUser || 0) * oferta?.ValorUInstantaneo - costoTotal).toFixed(2)}
                        </p>
                    )}
                    <p className="paragraph">
                    <b>Total: $ {!!unidadesUser ? costoTotal.toFixed(2) : 0}</b>
                    </p>
                </div>
              </div>
            </div>
          </div>

          <div className="metodoPago__btnBox">
            <button
              type="button"
              onClick={() => setShowCompraInstantanea(false)}
              className="btn btn--red"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn--blue">
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};