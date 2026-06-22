import { useForm } from "../../hooks";
import { useEffect, useState } from "react";
import { provincias } from "../../data";
import { AccionExitosaAuth } from "./AccionExitosaAuth";
import { apiUrl } from "../../apiUrl";

export const FormRegistrarProveedor = () => {
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);
  const [listaCiudadesUser, setListaCiudadesUser] = useState([]);
  const [tipoIdSelected, setTipoIdSelected] = useState("");
  const [imgExists, setImgExists] = useState(false);
  const [imagen, setImagen] = useState("no-img.jpeg");

  // Validaciones
  const [esUsuarioValido, setEsUsuarioValido] = useState(true);
  const [esNumeroValido, setEsNumeroValido] = useState(true);
  const [esNombreValido, setEsNombreValido] = useState(true);
  const [esIdentificacionValido, setEsIdentificacionValido] = useState(true);
  const [esContrasenaValido, setEsContrasenaValido] = useState(true);
  const [esEmailValido, setEsEmailValido] = useState(true);
  const [esCiudadValido, setEsCiudadValido] = useState(true);
  const [esConfValido, setEsConfValido] = useState(true);

  const {
    formState,
    Nombre,
    Identificacion,
    Usuario,
    Contrasena,
    ContrasenaConf,
    urlImg,
    TipoId,
    Provincia,
    Email,
    Numero,
    Ciudad,
    Direccion,
    onInputChange,
    setNameValueEmpty,
  } = useForm({
    IdRol: 2, // Rol Proveedor
    Nombre: "",
    Identificacion: "",
    Usuario: "",
    Contrasena: "",
    Email: "",
    Numero: "",
    Pais: "Ecuador",
    Provincia: "",
    Ciudad: "",
    Direccion: "",
    TipoId: "Cédula",
    ContrasenaConf: "",
    urlImg: imagen,
  });

  const uploadSolicitud = async () => {
    const newBody = { ...formState, urlImg: imagen };
    try {
      const resp = await fetch(`${apiUrl}/solicitudRegistro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBody),
      });
      const data = await resp.json();
      console.log("Solicitud enviada:", data);
    } catch (error) {
      console.error("Error enviando solicitud:", error);
    }
  };


  // --- EFECTOS DE VALIDACIÓN ---
  useEffect(() => { setEsUsuarioValido(true); }, [Usuario]);
  useEffect(() => { setEsNumeroValido(true); }, [Numero]);
  useEffect(() => { setEsNombreValido(true); }, [Nombre]);
  useEffect(() => { setEsEmailValido(true); }, [Email]);
  useEffect(() => { setEsIdentificacionValido(true); }, [Identificacion]);
  useEffect(() => { setEsContrasenaValido(true); }, [Contrasena]);
  useEffect(() => { setEsCiudadValido(true); }, [Ciudad]);
  useEffect(() => { setEsConfValido(true); }, [ContrasenaConf]);

  // --- MÉTODOS AUXILIARES ---
  const checkValidUsername = async () => {
    const regexUsername = /^[a-zA-Z0-9_]{3,30}$/;
    if (!regexUsername.test(Usuario)) {
      setEsUsuarioValido(false);
      return;
    }
    try {
      const resp = await fetch(`${apiUrl}/validarusuario?username=${Usuario}`);
      const data = await resp.json();
      const { rows: result } = !!data && data;
      setEsUsuarioValido(result.length === 0);
    } catch (error) {
      console.error(error);
    }
  };

  const validarTodosCampos = () => {
    return new Promise((resolve, reject) => {
      checkValidUsername();

      const regexEmail = /^\w+([-]?\w+)*@\w+([-]?\w+)*(.\w{2,3})+$/;
      const regexNumero = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im;
      const regexCedula = /^[0-9]{9}[-]?[0-9][-]?([0-9]{3})?$/;
      const regexContrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      const regexNombre = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+[ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+$/;
      const regexCiudad = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+([ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+)?$/;

      if (
        esUsuarioValido &&
        regexCiudad.test(Ciudad) &&
        regexCedula.test(Identificacion) &&
        regexNombre.test(Nombre) &&
        regexEmail.test(Email) &&
        regexNumero.test(Numero) &&
        regexContrasena.test(Contrasena) &&
        Contrasena === ContrasenaConf
      ) {
        resolve(true);
      } else {
        setEsCiudadValido(regexCiudad.test(Ciudad));
        setEsIdentificacionValido(regexCedula.test(Identificacion));
        setEsNombreValido(regexNombre.test(Nombre));
        setEsEmailValido(regexEmail.test(Email));
        setEsNumeroValido(regexNumero.test(Numero));
        setEsContrasenaValido(regexContrasena.test(Contrasena));
        setEsConfValido(Contrasena === ContrasenaConf);
        reject(false);
      }
    });
  };

  const getImg = async (urlImg) => {
    const reader = new FileReader();
    reader.readAsDataURL(urlImg);
    reader.onloadend = () => {
      const base64data = reader.result;
      setImagen(base64data);
    };
  };

  const onRegistrarSolicitud = (e) => {
    e.preventDefault();
    validarTodosCampos()
      .then((res) => uploadSolicitud().then(setShowAccionExitosa(true)))
      .catch((res) => {
        console.warn("Usuario no válido");
      });
  };

  const printStates = () => {
    let childrenArray = [];
    for (const key in provincias) {
      const nombre_provincia = provincias[key].provincia;
      const nom =
        nombre_provincia.charAt(0) +
        nombre_provincia.substring(1).toLowerCase();
      childrenArray.push(
        <option value={nom} key={nom}>
          {nom}
        </option>
      );
    }
    return childrenArray;
  };

  useEffect(() => {
    let lista = [];
    for (const key in provincias) {
      if (provincias[key].provincia === Provincia.toUpperCase()) {
        let resList = provincias[key].cantones;
        for (const key in resList) {
          const ciudadNombre = resList[key].canton;
          lista.push(
            ciudadNombre.charAt(0) +
              ciudadNombre.substring(1).toLowerCase()
          );
        }
      }
    }
    setListaCiudadesUser(lista);
  }, [Provincia]);

  useEffect(() => {
    setTipoIdSelected(TipoId);
  }, [TipoId]);

  useEffect(() => {
    if (urlImg !== "no-img.jpeg") {
      setImgExists(true);
      getImg(urlImg);
    } else {
      setImgExists(false);
    }
  }, [urlImg]);

  const onDeleteImg = () => {
    setImgExists(false);
    const inp = document.getElementById("formSubirLogo");
    inp.value = "";
    setNameValueEmpty("urlImg");
  };

  // --- RENDERIZADO VISUAL ACTUALIZADO ---
  return (
    <form onSubmit={onRegistrarSolicitud} style={{ width: "100%" }}>
      
      {/* FILA 1: Usuario y Nombre */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Usuario <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorUsuario"
            type="text"
            placeholder="Ej. mi_empresa"
            className="form-group__input"
            name="Usuario"
            value={Usuario}
            onChange={onInputChange}
            required
          />
          {!esUsuarioValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Usuario no válido</p>
          )}
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Nombre / Empresa <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorName"
            type="text"
            placeholder="Ej. Distribuidora XYZ"
            className="form-group__input"
            name="Nombre"
            value={Nombre}
            onChange={onInputChange}
            required
          />
          {!esNombreValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Nombre inválido</p>
          )}
        </div>
      </div>

      {/* FILA 2: Contraseñas */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Contraseña <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorContrasena"
            type="password"
            placeholder="••••••••"
            className="form-group__input"
            name="Contrasena"
            value={Contrasena}
            onChange={onInputChange}
            required
          />
          {!esContrasenaValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", fontSize: "1.1rem", marginTop: '0.5rem' }}>
              Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número.
            </p>
          )}
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Confirmar Contraseña <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorContrasenaConf"
            type="password"
            placeholder="••••••••"
            className="form-group__input"
            name="ContrasenaConf"
            value={ContrasenaConf}
            onChange={onInputChange}
            required
          />
          {!esConfValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>No coinciden</p>
          )}
        </div>
      </div>

      {/* FILA 3: Identificación */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ width: "30%", minWidth: "100px" }}>
          <label className="form-group__label">
            Tipo ID <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <select
            id="identificacionUserProv"
            name="TipoId"
            className="form-group__input"
            onChange={onInputChange}
            value={TipoId}
          >
            <option value="Cédula">Cédula</option>
            <option value="RUC">RUC</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-group__label">
            {tipoIdSelected} <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorIdentificacion"
            type="text"
            placeholder={tipoIdSelected === "Cédula" ? "099..." : "099...001"}
            className="form-group__input"
            name="Identificacion"
            value={Identificacion}
            onChange={onInputChange}
            required
          />
          {!esIdentificacionValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Inválido</p>
          )}
        </div>
      </div>

      {/* FILA 4: Contacto */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            E-mail <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorEmail"
            type="email"
            placeholder="contacto@empresa.com"
            className="form-group__input"
            name="Email"
            value={Email}
            onChange={onInputChange}
            required
          />
          {!esEmailValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Inválido</p>
          )}
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Celular <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <input
            id="proveedorCelular"
            type="tel"
            placeholder="099..."
            className="form-group__input"
            name="Numero"
            value={Numero}
            onChange={onInputChange}
            required
          />
          {!esNumeroValido && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Inválido</p>
          )}
        </div>
      </div>

      {/* FILA 5: Ubicación */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Provincia <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <select
            id="proveedorProvincia"
            name="Provincia"
            className="form-group__input"
            onChange={onInputChange}
            value={Provincia}
          >
            <option value="">Seleccionar Provincia</option>
            {printStates()}
          </select>
          {(Provincia === "Seleccionar Provincia") && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Requerido</p>
          )}
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
          <label className="form-group__label">
            Ciudad <span style={{ color: "#E53E3E" }}>*</span>
          </label>
          <select
            id="proveedorCiudad"
            name="Ciudad"
            className="form-group__input"
            onChange={onInputChange}
            value={Ciudad}
          >
            <option value="">Seleccionar Ciudad</option>
            {listaCiudadesUser?.map((ciudad) => (
              <option value={ciudad} key={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          {(!esCiudadValido || (Ciudad === "Seleccionar Ciudad" && Provincia)) && (
            <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Requerido</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="form-group">
        <label className="form-group__label">
          Dirección <span style={{ color: "#E53E3E" }}>*</span>
        </label>
        <textarea
          id="proveedorDireccion"
          placeholder="Dirección fiscal o bodega principal"
          className="form-group__input"
          style={{ height: "8rem", resize: "none", fontFamily: 'inherit' }}
          name="Direccion"
          value={Direccion}
          onChange={onInputChange}
          required
        />
      </div>

      {/* Foto/Logo */}
      <div className="form-group">
        <label className="form-group__label" htmlFor="formSubirLogo">
          Logo de la Empresa
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
            id="formSubirLogo"
            type="file"
            className="form-group__input"
            name="urlImg"
            accept="image/*"
            onChange={onInputChange}
            style={{ padding: '0.8rem' }}
            />
            
            {/* Previsualización */}
            {imgExists && (
                <div style={{ position: "relative", width: "50px", height: "50px" }}>
                    <img
                        src={imagen}
                        alt="Previsualización"
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E0"
                        }}
                    />
                    <span
                        className="material-symbols-rounded"
                        onClick={onDeleteImg}
                        style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "#E53E3E",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "14px",
                        cursor: "pointer",
                        padding: "2px"
                        }}
                    >
                        close
                    </span>
                </div>
            )}
        </div>
      </div>

      {/* Botón Submit */}
      <div style={{ marginTop: "3rem" }}>
        <button type="submit" className="btn btn--blue" style={{ width: "100%" }}>
          Enviar Solicitud
        </button>
      </div>

      {/* Modal Éxito */}
      {showAccionExitosa && (
        <AccionExitosaAuth
          texto={"¡La solicitud de registro se ha enviado correctamente!"}
          setShowAccionExitosa={setShowAccionExitosa}
        />
      )}
    </form>
  );
};