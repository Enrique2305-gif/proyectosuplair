import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../apiUrl";
import { useForm } from "../../hooks/useForm";
import { AuthContext } from "../context";
import { getHomeByUser } from "../helpers";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { username, password, onInputChange } = useForm({
    username: "",
    password: "",
  });

  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [usernameIsValid, setUsernameIsValid] = useState(true);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // --- Helpers de red y Auth (TU LÓGICA INTACTA) ---
  const validateUsername = async (u) => {
    const raw = u ?? username ?? "";
    const q = String(raw).trim();
    if (!q) {
      setUsernameIsValid(true);
      return true;
    }
    try {
      setIsCheckingUser(true);
      const resp = await fetch(
        `${apiUrl}/validarusuario?username=${encodeURIComponent(q)}`
      );

      if (!resp.ok) {
        setUsernameIsValid(true);
        return true;
      }

      const data = await resp.json();
      const exists =
        (typeof data?.exists === "boolean" && data.exists) ||
        (Array.isArray(data?.rows) && data.rows.length > 0);

      setUsernameIsValid(exists);
      return exists;
    } catch (err) {
      console.error("Error validando usuario:", err);
      setUsernameIsValid(true);
      return true;
    } finally {
      setIsCheckingUser(false);
    }
  };

  const getAuthResponse = async () => {
    const body = {
      usuario: String(username ?? "").trim(),
      pass: String(password ?? ""),
    };

    const resp = await fetch(`${apiUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      setPasswordIsValid(false);
      return null;
    }
    return data[0];
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    const exists = await validateUsername();
    if (!exists) return;

    const user = await getAuthResponse();
    if (!user) return;

    // login(user);
    // switch (user.Rol) {
    //   case "comprador":
    //     navigate("/comprador", { replace: true });
    //     return;
    //   case "proveedor":
    //     navigate("/proveedor", { replace: true });
    //     return;
    //   default:
    //     navigate("/administrador", { replace: true });
    //     return;
    // }
    login(user);
      navigate(getHomeByUser(user), { replace: true });
  };

  const onClickRegistro = () => {
    navigate("/signup", { replace: true });
  };

  useEffect(() => {
    setPasswordIsValid(true);
    setUsernameIsValid(true);
  }, [username]);

  // --- NUEVA ESTRUCTURA VISUAL ---
  return (
    <div className="login-page animate__animated animate__fadeIn">
      
      {/* 1. SECCIÓN IZQUIERDA (IMAGEN) */}
      <div className="login-page__image-section">
        <div style={{ position: 'relative', zIndex: 2 }}>
            <h1>SUPLAIER</h1>
            <p>Conecta con proveedores confiables y optimiza tus compras mayoristas en una sola plataforma.</p>
        </div>
      </div>

      {/* 2. SECCIÓN DERECHA (FORMULARIO) */}
      <div className="login-page__form-section">
        <div className="login-page__card">
          
          <div className="login-page__header">
            {/* Logo: Asegúrate que la ruta sea correcta */}
            <img
              src="/suplaier_logo celeste.png"
              alt="Suplaier Logo"
            />
            <h2>Bienvenido de nuevo</h2>
            <p className="paragraph paragraph--sm paragraph--grey">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={onSubmitLogin}>
            
            {/* Input Usuario */}
            <div className="login-page__input-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ej. empresa_sa"
                onChange={onInputChange}
                onBlur={(e) => validateUsername(e.target.value)}
                required
                autoComplete="off"
              />
              {/* Feedback Visual */}
              {!usernameIsValid && (
                 <p className="paragraph--sm" style={{color: '#E53E3E', marginTop: '5px'}}>
                    ⚠️ El usuario no existe
                 </p>
              )}
              {isCheckingUser && (
                 <p className="paragraph--sm" style={{color: '#3182CE', marginTop: '5px'}}>
                    Verificando...
                 </p>
              )}
            </div>

            {/* Input Contraseña */}
            <div className="login-page__input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                onChange={onInputChange}
                required
              />
              {!passwordIsValid && usernameIsValid && (
                 <p className="paragraph--sm" style={{color: '#E53E3E', marginTop: '5px'}}>
                    ⚠️ Contraseña incorrecta
                 </p>
              )}
            </div>

            {/* Botón Principal */}
            <div className="login-page__actions">
              <button type="submit" className="btn btn--purple">
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Footer / Registro */}
          <div className="login-page__footer">
            <p>
              ¿Aún no tienes cuenta?{" "}
              {/* Usamos btn-text para que sea un enlace elegante, no un botón gigante */}
              <button 
                onClick={onClickRegistro} 
                className="btn-text" 
                style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.4rem'}}
              >
                Regístrate aquí
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};