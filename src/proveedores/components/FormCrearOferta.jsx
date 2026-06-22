import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { useForm } from "../../hooks";
import { AccionExitosa } from "./AccionExitosa";
import { ResumenOferta } from "./ResumenOferta";

export const FormCrearOferta = () => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;

  const d = new Date();

  const {
      formState,
      idProducto,
      idValorInst,
      cantMin,
      cantMax,
      descripcion,
      fechaLimite,
      costoUnitario,
      costoInstantaneo,
      onInputChange} = useForm({
        idProducto: -1,
        idProveedor: user.IdUsuario,
        cantMin: 0,
        cantMax: 0,
        costoUnitario: 0,
        idValorInst: "sinInst",
        costoInstantaneo: 0, 
        descripcion: "",
        actualProductos: 0,
        fechaLimite: "",
        estado: true,
        idEstadoOferta: 1,
      });

  const [productosProv, setProductosProv] = useState([]);
  const [producto, setProducto] = useState({});
  const [productoExiste, setProductoExiste] = useState(false);
  const [imagen, setImagen] = useState();
  const [showResumenOferta, setShowResumenOferta] = useState(false);
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);

  //validadores
  const [esProductoValido, setEsProductoValido] = useState(false);
  const [esValorUnitariValido, setEsValorUnitariValido] = useState(false);
  const [esValorInstValido, setEsValorInstValido] = useState(false);
  const [esDescOfertaValido, setEsDescOfertaValido] = useState(false);
  const [esUnidadesMinValido, setEsUnidadesMinValido] = useState(false);
  const [esUnidadesMaxValido, setEsUnidadesMaxValido] = useState(false);
  const [esFechaValida, setEsFechaValida] = useState(false);

  const checkFechaLimiteisValid = async() => {
    const resp = await fetch(`${apiUrl}/obtenerahora`);
    const data = await resp.json();
    const {rows: ahora} = !!data && data;

    const fechaLocaly1 = d.toLocaleDateString(ahora[0]).split("/");
    const fechaLocaly2 = `${fechaLocaly1[2]}-${fechaLocaly1[0].length === 1 ? "0"+fechaLocaly1[0] : fechaLocaly1[0]}-${fechaLocaly1[1]}T`
    
    const horaLocaly2 = d.toLocaleTimeString(ahora[0]).split(" ");
    const horaLocalyEsp = horaLocaly2[0].split(":"); //hora min sec
   
    let horaLocaly3 = "";
    horaLocaly2[1] === "AM"
    ? horaLocaly3 = parseInt(horaLocalyEsp[0])
    : horaLocaly3 = 12 + parseInt(horaLocalyEsp[0]);

    const horaResult = `${horaLocaly3.toString().length === 1 ? "0"+horaLocaly3 : horaLocaly3}:${horaLocalyEsp[1]}:${horaLocalyEsp[2].length === 1 ? "0"+horaLocalyEsp[2] : horaLocalyEsp[2]}`
    const horaResultFinal = `${fechaLocaly2}${horaResult}`;
    const fechaLimiteFinal = `${fechaLimite}:00`;
    setEsFechaValida(horaResultFinal < fechaLimiteFinal)
  }

  const validarTodosCampos = () => {
    return new Promise((resolve, reject) => {
      
      checkFechaLimiteisValid();
      
      const productoValido = idProducto !== "Seleccionar producto" && idProducto !== -1;
      const regexDescripcion = /^([a-zA-Z0-9 _-àáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ,.]){3,500}$/;
      const regexValorUnitario = /^((.\d+)|(\d+(.\d+)?))$/;
      const regexValorInstantaneo = /^((.\d+)|(\d+(.\d+)?))$/;
      const regexUnidadesMinMax = /^[1-9]([0-9]+)?$/;

      if(productoValido && regexDescripcion.test(descripcion) && regexValorUnitario.test(costoUnitario)
          && regexUnidadesMinMax.test(cantMin) 
          && regexUnidadesMinMax.test(cantMax)
          && regexValorInstantaneo.test(costoInstantaneo) 
          //&& (cantMin <= cantMax)
          ){
        
          resolve(true);

      } else {
        setEsProductoValido(productoValido);
        setEsValorUnitariValido(regexValorUnitario.test(costoUnitario));
        setEsValorInstValido(regexValorInstantaneo.test(costoInstantaneo));
        setEsDescOfertaValido(regexDescripcion.test(descripcion));
        setEsUnidadesMinValido(regexUnidadesMinMax.test(cantMin));
        setEsUnidadesMaxValido(regexUnidadesMinMax.test(cantMax));

        reject(false);
      }
    })
  }

  const onContinuarCrearOferta = async(e) => {
    e.preventDefault();
    await validarTodosCampos()
       .then(res => setShowResumenOferta(true))
       .catch(res => console.warn(res));
  }

  const getProductos = async() => {
    const resp = await fetch(`${apiUrl}/productos?idProveedor=${user.IdUsuario}`);
    const data = await resp.json();
    const {rows: productos} = !!data && data;
    setProductosProv(productos);
  }

  useEffect(() => {
    setEsFechaValida(true);
  }, [fechaLimite]);

  useEffect(() => {
    setEsProductoValido(true);
  }, [idProducto]);
  
  useEffect(() => {
    setEsValorUnitariValido(true)
  }, [costoUnitario]);

  useEffect(() => {
    setEsValorInstValido(true)
  }, [costoInstantaneo]);
  
  useEffect(() => {
    setEsUnidadesMinValido(true)
  }, [cantMin]);
  
  useEffect(() => {
    setEsUnidadesMaxValido(true);
  }, [cantMax]);

  useEffect(() => {
    setEsDescOfertaValido(true);
  }, [descripcion])
  
  
  useEffect(() => {
    getProductos();
    // eslint-disable-next-line
  }, [])
  
  const getProductoSelect = async(id) => {
    if (id !== "Seleccionar producto" && id !== -1) {
      const resp = await fetch(`${apiUrl}/productos?id=${id}`);
      const data = await resp.json();
      const {rows: producto} = !!data && data;
      setProductoExiste(true);
      setProducto(producto[0]);
    } else {
      setProductoExiste(false);
    }
    
  }

  const getImg = async (urlImg, id) => {
    if (id !== "Seleccionar producto" && id !== -1) {
      setImagen(urlImg);
    }
  };

  useEffect(() => {
    getProductoSelect(idProducto);
  }, [idProducto]);

  useEffect(() => {
    getImg(producto.UrlImg, idProducto);
  }, [producto, idProducto])
  

  return (
    <form onSubmit={onContinuarCrearOferta}>
      <div className="compraProducto__box">
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp formRegistrarComp__label"><b>Producto</b></label>
            <div className="formRegistrarComp__boxError">
              <select 
                id="formOfertaNombreProd"
                name="idProducto"
                className="formRegistrarComp__input paragraph"
                onChange={onInputChange}
              >
                <option defaultValue={"none"}>
                  Seleccionar producto
                </option> 
                {
                  productosProv?.map(prod => 
                    <option value={prod.IdProducto} key={prod.Name}>
                      {prod.Name}
                    </option>)
                }
              </select>
              {
                !esProductoValido &&
                <p className="paragraph--red u-padding-left-small">Por favor seleccione un producto</p>
              }
            </div>
            
          </div>
          {
          productoExiste && 
          <div className="formCrearOferta__productoBox u-margin-top-small">
            <div className="formCrearOferta__productoBox__imgBox">
              <img 
                className="formCrearOferta__productoBox__imgBox__img" 
                src={imagen} 
                alt={producto?.Name} 
              />
            </div>
            <div className="oferta-detalle__productoBox__desc">
              <div className="oferta-detalle__productoBox__desc__text">
                <p className="paragraph"><b>{producto?.Name}</b></p>
                <p className="paragraph">{producto?.Descripcion}</p>
              </div>
            </div>
          </div>
          }
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Precio unitario</b></label>
            <input
              type="number"
              placeholder="Precio unitario en USD"
              className="formSubirProducto__inputBox__input paragraph paragraph--grey--2"
              name="costoUnitario"
              autoComplete="off"
              value={costoUnitario}
              onChange={onInputChange}
              required
            />
            {
              !esValorUnitariValido &&
              <p className="paragraph--red u-padding-left-small">Costo unitario no válido</p>
            }
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp formRegistrarComp__label"><b>Valor instantáneo</b></label>
            <div className="formRegistrarComp__boxError">
              <select 
                id="formOfertaValorInst"
                name="idValorInst"
                className="formRegistrarComp__input paragraph"
                onChange={onInputChange}
              >
                <option value="sinInst">
                  Sin precio instantáneo
                </option>
                <option value="conInst">
                  Con precio instantáneo
                </option> 
              </select>
          
            </div>
            
          </div>
          {
                idValorInst==="conInst" &&            
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Precio instantáneo</b></label>
            <input
              type="number"
              placeholder="Precio instantáneo en USD"
              className="formSubirProducto__inputBox__input paragraph paragraph--grey--2"
              name="costoInstantaneo"
              autoComplete="off"
              value={costoInstantaneo}
              onChange={onInputChange}
              required
            />
            {
              !esValorInstValido &&
              <p className="paragraph--red u-padding-left-small">Costo instantáneo no válido</p>
            }  
          </div>
}
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Descripción</b></label>
            <textarea
              type="text"
              placeholder="Descripción de la oferta"
              className="formSubirProducto__inputBox__textArea paragraph"
              name="descripcion"
              autoComplete="off"
              value={descripcion}
              onChange={onInputChange}
              required
            />
            {
              !esDescOfertaValido &&
              <p className="paragraph--red u-padding-left-small">Descripción no válida</p>
            }
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Cantidad mínima</b></label>
            <input
              type="number"
              placeholder="Unidades mínimas para cerrar la oferta"
              className="formSubirProducto__inputBox__input paragraph paragraph--grey--2"
              name="cantMin"
              autoComplete="off"
              value={cantMin}
              onChange={onInputChange}
              min={1}
              required
            />
            {
              !esUnidadesMinValido &&
              <p className="paragraph--red u-padding-left-small">Cantidad de unidades mínima no válida</p>
            }
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Cantidad máxima</b></label>
            <input
              type="number"
              placeholder="Unidades en total a vender"
              className="formSubirProducto__inputBox__input paragraph paragraph--grey--2"
              name="cantMax"
              autoComplete="off"
              value={cantMax}
              onChange={onInputChange}
              min={1}
              required
            />
            {
              !esUnidadesMaxValido &&
              <p className="paragraph--red u-padding-left-small">Cantidad de unidades en total no válida</p>
            }
          </div>
          <div className="formSubirProducto u-margin-top-small">
            <label htmlFor="formOfertaNombreProd" align="right" className="paragraph--smResp paragraph--bold formSubirProducto__label"><b>Fecha límite</b></label>
            <input
              type="date"
              className="paragraph paragraph--grey--2"
              name="fechaLimite"
              autoComplete="off"
              value={fechaLimite}
              onChange={onInputChange}
              required
            />
            {
              !esFechaValida &&
              <p className="paragraph--red u-padding-left-small">Fecha no válida</p>
            }
          </div>
      </div>

      <div className="metodoPago__btnBox">
        <button
          type="submit" 
          className="btn btn--blue"
        >Continuar</button>
        {
          showResumenOferta &&
          <ResumenOferta 
            formState={formState} 
            setShowResumenOferta={setShowResumenOferta}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        }
        {
          showAccionExitosa &&
          <AccionExitosa
            texto={'¡Oferta creada con éxito!'}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        }
      </div>
    </form>
  )
}
