import { useForm } from "../../hooks";
import { useEffect, useState } from "react";
import { provincias } from "../../data";
import { AccionExitosaAuth } from "./AccionExitosaAuth";
import { apiUrl } from "../../apiUrl";
import { TerminosPage } from "../pages";
import { useReward } from "../../ui/RewardContext";

// Helpers
const normalizeCode = (s = "") => s.trim().replace(/\s+/g, "").toUpperCase();
const reCodigoCanje = /^[A-Z0-9]{6,64}$/;

export const FormRegistrarComprador = () => {
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);
  const [listaCiudadesUser, setListaCiudadesUser] = useState([]);
  const [tipoIdSelected, setTipoIdSelected] = useState("");
  const [imgExists, setImgExists] = useState(false);
  const [imagen, setImagen] = useState("no-img.jpeg");
  const [showTerminos, setShowTerminos] = useState(false);
  // const navigate = useNavigate(); // No se usa en el render, pero se deja por si acaso
  const { setReward } = useReward();

  // Validaciones
  const [esUsuarioValido, setEsUsuarioValido] = useState(true);
  const [esNumeroValido, setEsNumeroValido] = useState(true);
  const [esNombreValido, setEsNombreValido] = useState(true);
  const [esIdentificacionValido, setEsIdentificacionValido] = useState(true);
  const [esContrasenaValido, setEsContrasenaValido] = useState(true);
  const [esEmailValido, setEsEmailValido] = useState(true);
  const [esProvinciaValido, setEsProvinciaValido] = useState(true);
  const [esCiudadValido, setEsCiudadValido] = useState(true);
  const [esConfValido, setEsConfValido] = useState(true);
  const [esCodigoInvitacionValido, setEsCodigoInvitacionValido] = useState(true);

  const {
    formState,
    Nombre,
    Identificacion,
    Usuario,
    Contrasena,
    ContrasenaConf,
    Email,
    urlImg,
    Numero,
    TipoId,
    Provincia,
    Ciudad,
    Direccion,
    CodigoInvitacion,
    onInputChange,
    setNameValueEmpty,
  } = useForm({
    IdRol: 1,
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
    CodigoInvitacion: "",
    urlImg: imagen,
  });

  // --- LÓGICA DE UPLOAD (INTACTA) ---
  const uploadUser = async () => {
    const newBody = { ...formState, urlImg: imagen };
    const { ContrasenaConf, CodigoInvitacion, ...payload } = newBody;

    try {
      const resp = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("Registro falló:", resp.status, errText);
        alert(`No se pudo registrar (${resp.status}): ${errText}`);
        return;
      }

      const data = await resp.json();
      const userId =
        data?.userId ?? data?.insertId ?? data?.rows?.[0]?.IdUsuario ?? null;

      let rewardMostrado = false;
      const raw = (CodigoInvitacion || "").trim();

      if (userId && raw) {
        const code = raw.replace(/\s+/g, "").toUpperCase();
        try {
          const r2 = await fetch(`${apiUrl}/recompensas/canjear-invitacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, code }),
          });
          const canje = await r2.json().catch(() => ({}));

          if (canje?.ok || canje?.alreadyClaimed) {
            rewardMostrado = true;
            const stars = Number(canje?.award?.stars || 0);
            const msg =
              canje?.award?.message ||
              (canje?.alreadyClaimed
                ? "Este código ya fue canjeado anteriormente."
                : "Código canjeado con éxito.");

            setReward({
              show: true,
              title: canje?.alreadyClaimed ? "Código ya canjeado" : "¡Bienvenido!",
              message: msg,
              stars,
              balance: canje?.balance ?? null,
              onClose: () => setShowAccionExitosa(true),
            });
          }
        } catch (err) {
          console.error("Error canjeando invitación:", err);
        }
      }

      if (!rewardMostrado) {
        setShowAccionExitosa(true);
      }
    } catch (e) {
      console.error("Error en registro:", e);
      alert("No se pudo registrar: " + e.message);
    }
  };

  // --- VALIDACIONES (INTACTAS) ---
  const checkValidUsername = async () => {
    const regexUsername = /^[a-zA-Z0-9_]{3,30}$/;
    if (!regexUsername.test(Usuario)) {
      setEsUsuarioValido(false);
      return false;
    }
    try {
      const resp = await fetch(
        `${apiUrl}/validarusuario?username=${encodeURIComponent(Usuario)}`
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const { rows = [] } = data || {};
      const esValido = rows.length === 0;
      setEsUsuarioValido(esValido);
      return esValido;
    } catch (error) {
      console.error("Error al validar el usuario:", error);
      setEsUsuarioValido(false);
      return false;
    }
  };

  const checkValidarCodigo = () => {
    if (!CodigoInvitacion) {
      setEsCodigoInvitacionValido(true);
      return true;
    }
    const ok = reCodigoCanje.test(normalizeCode(CodigoInvitacion));
    setEsCodigoInvitacionValido(ok);
    return ok;
  };

  const validarTodosCampos = () => {
    return new Promise(async (resolve, reject) => {
      const esUsuarioOk = await checkValidUsername();
      const regexEmail = /^\w+([-]?\w+)*@\w+([-]?\w+)*(.\w{2,3})+$/;
      const regexNumero = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im;
      const regexCedula = /^[0-9]{9}[-]?[0-9][-]?([0-9]{3})?$/;
      const regexNombre = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+[ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+$/;
      const regexCiudad = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+([ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+)?$/;
      const regexContrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!_.-]{8,}$/;

      const esProvinciaOk = Provincia !== "Seleccionar Provincia" && Provincia !== "";
      const esCiudadOk = regexCiudad.test(Ciudad);
      const esCedulaOk = regexCedula.test(Identificacion);
      const esNombreOk = regexNombre.test(Nombre);
      const esEmailOk = regexEmail.test(Email);
      const esNumeroOk = regexNumero.test(Numero);
      const esContrasenaOk = regexContrasena.test(Contrasena);
      const esConfOk = Contrasena === ContrasenaConf;
      const esCodigoInvitacionOk = checkValidarCodigo();
      setEsCodigoInvitacionValido(esCodigoInvitacionOk);
      const esCodigoExistenteOk = true;

      setEsProvinciaValido(esProvinciaOk);
      setEsCiudadValido(esCiudadOk);
      setEsIdentificacionValido(esCedulaOk);
      setEsNombreValido(esNombreOk);
      setEsEmailValido(esEmailOk);
      setEsNumeroValido(esNumeroOk);
      setEsContrasenaValido(esContrasenaOk);
      setEsConfValido(esConfOk);

      if (
        esUsuarioOk && esCiudadOk && esProvinciaOk && esCedulaOk &&
        esNombreOk && esEmailOk && esNumeroOk && esContrasenaOk &&
        esConfOk && esCodigoInvitacionOk && esCodigoExistenteOk
      ) {
        resolve(true);
      } else {
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

  const onRegistrarComprador = (e) => {
    e.preventDefault();
    validarTodosCampos()
      .then((res) => {
        setShowTerminos(true);
      })
      .catch((res) => {
        console.warn("Usuario no válido");
      });
  };

  const printStates = () => {
    let childrenArray = [];
    for (const key in provincias) {
      const nombre_provincia = provincias[key].provincia;
      const nom =
        nombre_provincia.charAt(0) + nombre_provincia.substring(1).toLowerCase();
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
            ciudadNombre.charAt(0) + ciudadNombre.substring(1).toLowerCase()
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
    <div>
      <form onSubmit={onRegistrarComprador} style={{ width: "100%" }}>
        
        {/* FILA 1: Usuario y Nombre */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-group__label">
              Usuario <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              id="compradorUsuario"
              type="text"
              placeholder="Ej. jrodriguez"
              className="form-group__input"
              name="Usuario"
              value={Usuario}
              onChange={onInputChange}
              required
            />
            {!esUsuarioValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Usuario no válido o ya existe</p>
            )}
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-group__label">
              Nombre <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              id="compradorName"
              type="text"
              placeholder="Ej. Juan Rodríguez"
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
              id="compradorContrasena"
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
                Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (! _ . -)
              </p>
            )}
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-group__label">
              Confirmar Contraseña <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              id="compradorContrasenaConf"
              type="password"
              placeholder="••••••••"
              className="form-group__input"
              name="ContrasenaConf"
              value={ContrasenaConf}
              onChange={onInputChange}
              required
            />
            {!esConfValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Las contraseñas no coinciden</p>
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
              id="identificacionUser"
              name="TipoId"
              className="form-group__input" // Reutilizamos estilo input
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
              id="compradorIdentificacion"
              type="text"
              placeholder={tipoIdSelected === "Cédula" ? "099..." : "099...001"}
              className="form-group__input"
              name="Identificacion"
              value={Identificacion}
              onChange={onInputChange}
              required
            />
            {!esIdentificacionValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>{tipoIdSelected} no válida</p>
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
              id="compradorEmail"
              type="email"
              placeholder="ejemplo@correo.com"
              className="form-group__input"
              name="Email"
              value={Email}
              onChange={onInputChange}
              required
            />
            {!esEmailValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Email no válido</p>
            )}
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-group__label">
              Celular <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <input
              id="compradorCelular"
              type="tel"
              placeholder="099..."
              className="form-group__input"
              name="Numero"
              value={Numero}
              onChange={onInputChange}
              required
            />
            {!esNumeroValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Número no válido</p>
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
              id="compradorProvincia"
              name="Provincia"
              className="form-group__input"
              onChange={onInputChange}
              value={Provincia}
            >
              <option value="">Seleccionar Provincia</option>
              {printStates()}
            </select>
            {!esProvinciaValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Requerido</p>
            )}
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-group__label">
              Ciudad <span style={{ color: "#E53E3E" }}>*</span>
            </label>
            <select
              id="compradorCiudad"
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
            id="compradorDireccion"
            placeholder="Calle principal, número de casa, referencia..."
            className="form-group__input" // O form-group__textarea si lo definiste
            style={{ height: "8rem", resize: "none", fontFamily: 'inherit' }}
            name="Direccion"
            value={Direccion}
            onChange={onInputChange}
            required
          />
        </div>

        {/* FILA 6: Código e Imagen */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* Código Invitación */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-group__label">Código de invitación (Opcional)</label>
            <input
              id="compradorCodigoInvitacion"
              name="CodigoInvitacion"
              type="text"
              placeholder="Ej. PROMO2025"
              className="form-group__input"
              value={CodigoInvitacion}
              onChange={onInputChange}
            />
            {!esCodigoInvitacionValido && (
              <p className="paragraph--sm" style={{ color: "#E53E3E", marginTop: '0.5rem' }}>Formato incorrecto</p>
            )}
          </div>

          {/* Subir Foto */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-group__label" htmlFor="formSubirLogo">
              Foto de Perfil
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
        </div>

        {/* Botón Submit */}
        <div style={{ marginTop: "2rem" }}>
          <button type="submit" className="btn btn--blue" style={{ width: "100%" }}>
            Continuar
          </button>
        </div>

        {/* Modal Éxito */}
        {showAccionExitosa && (
          <AccionExitosaAuth
            texto={"¡Se ha registrado exitosamente!"}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        )}
      </form>

      {/* Modal Términos */}
      {showTerminos && (
        <TerminosPage
          uploadUser={uploadUser}
          setShowAccionExitosa={setShowAccionExitosa}
          setShowTerminos={setShowTerminos}
        />
      )}
    </div>
  );
};