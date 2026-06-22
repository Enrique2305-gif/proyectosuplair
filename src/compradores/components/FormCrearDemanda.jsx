import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { useForm } from "../../hooks";
import { AccionExitosa } from "./AccionExitosa";
import { ResumenDemanda } from "./ResumenDemanda";

export const FormCrearDemanda = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  // const d = new Date();

  const {
    formState,
    idProducto,
    cantMin,
    cantMax,
    descripcion,
    fechaLimite,
    precioMinimo,
    precioMaximo,
    onInputChange,
  } = useForm({
    idProducto: -1,
    idComprador: user.IdUsuario,
    cantMin: 0,
    cantMax: 0,
    precioMinimo: 0,
    precioMaximo: 0,
    descripcion: "",
    actualProductos: 0,
    fechaLimite: "",
    estado: true,
    idEstadoOferta: 1,
  });

  const [productosComp, setProductosComp] = useState([]);
  const [producto, setProducto] = useState({});
  const [productoExiste, setProductoExiste] = useState(false);
  const [imagen, setImagen] = useState();
  const [showResumenDemanda, setShowResumenDemanda] = useState(false);
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);
  const [showAccionErronea, setShowAccionErronea] = useState(false);

  //validadores
  const [esProductoValido, setEsProductoValido] = useState(false);
  const [esDescDemandaValido, setEsDescDemandaValido] = useState(false);
  const [esUnidadesMinValido, setEsUnidadesMinValido] = useState(false);
  const [esUnidadesMaxValido, setEsUnidadesMaxValido] = useState(false);
  const [esPrecioMaxValido, setEsPrecioMaxValido] = useState(false);
  const [esPrecioMinValido, setEsPrecioMinValido] = useState(false);
  const [esFechaValida, setEsFechaValida] = useState(false);

  const [razonPrecioMinInvalido, setRazonPrecioMinInvalido] = useState("");
  const [razonPrecioMaxInvalido, setRazonPrecioMaxInvalido] = useState("");
  const [razonUnidadesMinInvalido, setRazonUnidadesMinInvalido] = useState("");
  const [razonUnidadesMaxInvalido, setRazonUnidadesMaxInvalido] = useState("");

  const obtenerAhora = () => {
    const ahora = new Date();
    ahora.setDate(ahora.getDate() + 1);
    let year = ahora.getFullYear();
    let month = (ahora.getMonth() + 1).toString().padStart(2, "0");
    let day = ahora.getDate().toString().padStart(2, "0");
    let fechaString = year + "-" + month + "-" + day;
    console.log("Fecha en formato YYYY-MM-DD:", fechaString);
    return fechaString;
  };
  const obtenerLimite = () => {
    const limite = new Date();
    limite.setDate(limite.getDate() + 183);
    console.log(limite.getDate());
    let year = limite.getFullYear();
    let month = (limite.getMonth() + 1).toString().padStart(2, "0");
    let day = limite.getDate().toString().padStart(2, "0");
    let fechaString = year + "-" + month + "-" + day;
    console.log("Fecha en formato YYYY-MM-DD:", fechaString);
    return fechaString;
  };

  const checkFechaLimiteisValid = async () => {
    const resp = await fetch(`${apiUrl}/obtenerahora`);
    const data = await resp.json();
    const { rows: ahora } = !!data && data;
    // const fechaLocaly1 = d.toLocaleDateString(ahora[0]).split("/");
    // const fechaLocaly2 = `${fechaLocaly1[2]}-${
    //   fechaLocaly1[0].length === 1 ? "0" + fechaLocaly1[0] : fechaLocaly1[0]
    // }-${fechaLocaly1[1]}T`;

    // const horaLocaly2 = d.toLocaleTimeString(ahora[0]).split(" ");
    // const horaLocalyEsp = horaLocaly2[0].split(":"); //hora min sec

    // let horaLocaly3 = "";
    // horaLocaly2[1] === "AM"
    //   ? (horaLocaly3 = parseInt(horaLocalyEsp[0]))
    //   : (horaLocaly3 = 12 + parseInt(horaLocalyEsp[0]));

    // const horaResult = `${
    //   horaLocaly3.toString().length === 1 ? "0" + horaLocaly3 : horaLocaly3
    // }:${horaLocalyEsp[1]}:${
    //   horaLocalyEsp[2].length === 1 ? "0" + horaLocalyEsp[2] : horaLocalyEsp[2]
    // }`;
    // const horaResultFinal = `${fechaLocaly2}${horaResult}`;
    // const fechaLimiteFinal = `${fechaLimite}:00`;
    // setEsFechaValida(horaResultFinal < fechaLimiteFinal);
    // return horaResultFinal < fechaLimiteFinal;
    const fechaAhora = new Date(ahora[0]["getnow()"]);
    console.log(fechaAhora);
    const split = fechaLimite.split("-");
    const ingresada = new Date(split[0], parseInt(split[1] - 1), split[2]);
    console.log(ingresada);
    setEsFechaValida(ingresada > fechaAhora);
    return ingresada > fechaAhora;
  };

  const validarTodosCampos = () => {
    return new Promise((resolve, reject) => {
      const productoValido =
        idProducto !== "Seleccionar producto" && idProducto !== -1;
      const regexDescripcion =
        /^([a-zA-Z0-9 _-àáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ,.]){20,480}$/;
      const regexPrecioMinMax = /^\d+(\.[0-9]{2})?$/;
      const regexUnidadesMinMax = /^[1-9]([0-9]+)?$/;

      if (
        productoValido &&
        regexDescripcion.test(descripcion) &&
        regexPrecioMinMax.test(precioMaximo) &&
        regexPrecioMinMax.test(precioMinimo) &&
        regexUnidadesMinMax.test(cantMin) &&
        regexUnidadesMinMax.test(cantMax)

        //&& (cantMin <= cantMax)
      ) {
        resolve(true);
      } else {
        setRazonPrecioMinInvalido("Precio mínimo no válido");
        setEsProductoValido(productoValido);
        setEsPrecioMaxValido(regexPrecioMinMax.test(precioMaximo));
        setEsPrecioMinValido(regexPrecioMinMax.test(precioMinimo));
        setEsDescDemandaValido(regexDescripcion.test(descripcion));
        setEsUnidadesMinValido(regexUnidadesMinMax.test(cantMin));
        setEsUnidadesMaxValido(regexUnidadesMinMax.test(cantMax));

        reject(false);
      }
    });
  };
  const validarRestoCondiciones = () => {
    let crearDemanda = true;
    const precioMinimoInt = parseInt(precioMinimo);
    const precioMaximoInt = parseInt(precioMaximo);
    const cantMinInt = parseInt(cantMin);
    const cantMaxInt = parseInt(cantMax);
    if (precioMinimoInt > precioMaximoInt) {
      crearDemanda = false;
      setRazonPrecioMinInvalido(
        "El precio mínimo debe ser menor o igual al precio máximo"
      );
      setRazonPrecioMaxInvalido(
        "El precio máximo debe ser mayor o igual al precio mínimo"
      );
      setEsPrecioMinValido(false);
      setEsPrecioMaxValido(false);
    } else if (precioMinimoInt <= 0 || precioMinimoInt > 8000) {
      crearDemanda = false;
      setRazonPrecioMinInvalido(
        "El precio mínimo debe ser mayor a 0 y menor o igual a 8000"
      );
      setEsPrecioMinValido(false);
    }
    if (precioMaximoInt <= 0 || precioMaximoInt > 8000) {
      crearDemanda = false;
      setRazonPrecioMaxInvalido(
        "El precio máximo debe ser mayor a 0 y menor o igual a 8000"
      );
      setEsPrecioMaxValido(false);
    }

    if (parseInt(cantMinInt) > parseInt(cantMaxInt)) {
      setRazonUnidadesMinInvalido(
        "Las unidades mínimas deben ser menor o igual a  las unidades máximas"
      );
      setRazonUnidadesMaxInvalido(
        "Las unidades máximas deben ser mayor o igual a  las unidades mínimas"
      );
      setEsUnidadesMinValido(false);
      setEsUnidadesMaxValido(false);
      crearDemanda = false;
    } else if (cantMinInt <= 0 || cantMinInt > 10000) {
      setRazonUnidadesMinInvalido(
        "Las unidades mínimas deben ser mayor a 0 y menor o igual a 10000"
      );
      setEsUnidadesMinValido(false);
      crearDemanda = false;
    }
    if (cantMaxInt <= 0 || cantMaxInt > 10000) {
      setRazonUnidadesMaxInvalido(
        "Las unidades totales deben ser mayor a 0 y menor o igual a 10000"
      );
      setEsUnidadesMaxValido(false);
      crearDemanda = false;
    }
    if (crearDemanda === true) {
      setEsPrecioMaxValido(true);
      setEsPrecioMinValido(true);
      setEsUnidadesMinValido(true);
      setEsUnidadesMaxValido(true);
      setShowResumenDemanda(true);
    }
  };
  const validarCondicionesCampos = async () => {
    checkFechaLimiteisValid().then((v) => {
      if (v === true) {
        validarRestoCondiciones();
      }
    });
  };
  const onContinuarCrearDemanda = async (e) => {
    e.preventDefault();
    await validarTodosCampos()
      .then((res) => validarCondicionesCampos())
      .catch((res) => console.warn(res));
  };

  const getProductos = async () => {
    const resp = await fetch(
      `${apiUrl}/productos?idProveedor=${user.IdUsuario}`
    );
    const data = await resp.json();
    const { rows: productos } = !!data && data;
    setProductosComp(productos);
  };

  useEffect(() => {
    setEsFechaValida(true);
  }, [fechaLimite]);

  useEffect(() => {
    setEsProductoValido(true);
  }, [idProducto]);

  useEffect(() => {
    setEsPrecioMaxValido(true);
  }, [precioMaximo]);

  useEffect(() => {
    setEsPrecioMinValido(true);
  }, [precioMinimo]);

  useEffect(() => {
    setEsUnidadesMinValido(true);
  }, [cantMin]);

  useEffect(() => {
    setEsUnidadesMaxValido(true);
  }, [cantMax]);

  useEffect(() => {
    setEsDescDemandaValido(true);
  }, [descripcion]);

  useEffect(() => {
    getProductos();
    // eslint-disable-next-line
  }, []);

  const getProductoSelect = async (id) => {
    if (id !== "Seleccionar producto" && id !== -1) {
      const resp = await fetch(`${apiUrl}/productos?id=${id}`);
      const data = await resp.json();
      const { rows: producto } = !!data && data;
      setProductoExiste(true);
      setProducto(producto[0]);
    } else {
      setProductoExiste(false);
    }
  };

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
  }, [producto, idProducto]);

  return (
    <form onSubmit={onContinuarCrearDemanda}>
      <div className="compraProducto__box">
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp formSubirDemanda__label"
          >
            <b>Producto</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <select
              id="formOfertaNombreProd"
              name="idProducto"
              className="formSubirDemanda__inputBox__input paragraph"
              onChange={onInputChange}
            >
              <option defaultValue={"none"}>Seleccionar producto</option>
              {productosComp?.map((prod) => (
                <option value={prod.IdProducto} key={prod.Name}>
                  {prod.Name}
                </option>
              ))}
            </select>
            {!esProductoValido && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                Por favor seleccione un producto
              </p>
            )}
          </div>
        </div>
        {productoExiste && (
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
                <p className="paragraph">
                  <b>{producto?.Name}</b>
                </p>
                <p className="paragraph">{producto?.Descripcion}</p>
              </div>
            </div>
          </div>
        )}
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirDemanda__label"
          >
            <b>Precio mínimo</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <input
              type="number"
              placeholder="Precio mínimo para los productos de la demanda"
              className="formSubirDemanda__inputBox__input paragraph paragraph--grey--2"
              name="precioMinimo"
              autoComplete="off"
              value={precioMinimo}
              onChange={onInputChange}
              min={0}
              required
            />
            {!esPrecioMinValido && (
              <p className="formSubirProducto__inputBox__conditionError paragraph--red u-padding-left-small">
                {razonPrecioMinInvalido}
              </p>
            )}
          </div>
        </div>
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirDemanda__label"
          >
            <b>Precio máximo</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <input
              type="number"
              placeholder="Precio máximo para los productos de la demanda"
              className="formSubirDemanda__inputBox__input paragraph paragraph--grey--2"
              name="precioMaximo"
              autoComplete="off"
              value={precioMaximo}
              onChange={onInputChange}
              min={1}
              required
            />
            {!esPrecioMaxValido && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                {razonPrecioMaxInvalido}
              </p>
            )}
          </div>
        </div>
        <div className="formSubirProducto u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirProducto__label"
          >
            <b>Descripción</b>
          </label>
          <div className="formSubirProducto__inputBox u-margin-top-small">
            <textarea
              type="text"
              placeholder="Descripción de la demanda"
              className="formSubirDemanda__inputBox__textArea paragraph"
              name="descripcion"
              autoComplete="off"
              value={descripcion}
              onChange={onInputChange}
              required
            />
            {!esDescDemandaValido && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                Descripción no válida, no caracteres especiales diferentes a
                ,._- mínimo 20 y máximo 480 caracteres
              </p>
            )}
          </div>
        </div>
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirDemanda__label"
          >
            <b>Cantidad mínima</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <input
              type="number"
              placeholder="Unidades mínimas para cerrar la demanda"
              className="formSubirDemanda__inputBox__input paragraph paragraph--grey--2"
              name="cantMin"
              autoComplete="off"
              value={cantMin}
              onChange={onInputChange}
              min={1}
              required
            />
            {!esUnidadesMinValido && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                {razonUnidadesMinInvalido}
              </p>
            )}
          </div>
        </div>
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirDemanda__label"
          >
            <b>Cantidad máxima</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <input
              type="number"
              placeholder="Unidades en total a demandar"
              className="formSubirDemanda__inputBox__input paragraph paragraph--grey--2"
              name="cantMax"
              autoComplete="off"
              value={cantMax}
              onChange={onInputChange}
              min={1}
              required
            />
            {!esUnidadesMaxValido && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                {razonUnidadesMaxInvalido}
              </p>
            )}
          </div>
        </div>
        <div className="formSubirDemanda u-margin-top-small">
          <label
            htmlFor="formOfertaNombreProd"
            align="right"
            className="paragraph--smResp paragraph--bold formSubirDemanda__label"
          >
            <b>Fecha límite</b>
          </label>
          <div className="formSubirDemanda__inputBox u-margin-top-small">
            <input
              type="date"
              min={obtenerAhora()}
              max={obtenerLimite()}
              className="paragraph paragraph--grey--2"
              name="fechaLimite"
              autoComplete="off"
              value={fechaLimite}
              onChange={onInputChange}
              required
            />
            {!esFechaValida && (
              <p className="formSubirDemanda__inputBox__conditionError paragraph--red u-padding-left-small">
                Fecha no válida, la fecha límite debe ser mayor a la fecha
                actual
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="metodoPago__btnBox">
        <button type="submit" className="btn btn--blue">
          Continuar
        </button>
        {showResumenDemanda && (
          <ResumenDemanda
            formState={formState}
            setShowResumenDemanda={setShowResumenDemanda}
            setShowAccionExitosa={setShowAccionExitosa}
            setShowAccionErronea={setShowAccionErronea}
          />
        )}
        {showAccionExitosa && (
          <AccionExitosa
            texto={"¡Demanda creada con éxito!"}
            showAccionErronea={showAccionErronea}
            setShowAccionErronea={setShowAccionErronea}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        )}
        {showAccionErronea && (
          <AccionExitosa
            texto={"Hubo un error al intentar crear la demanda"}
            showAccionErronea={showAccionErronea}
            setShowAccionErronea={setShowAccionErronea}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        )}
      </div>
    </form>
  );
};
