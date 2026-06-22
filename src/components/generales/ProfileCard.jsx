import React, { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

const getInvitationCode = (user = {}) => {
  return (
    user?.codigo_invitacion ||
    user?.CodigoInvitacion ||
    user?.codigoInvitacion ||
    user?.Codigo ||
    ""
  );
};

const getRole = (user = {}) => {
  const role = user?.Rol || user?.rol || user?.IdRol || user?.idRol;

  if (role === 1 || role === "1" || role === "comprador") {
    return "comprador";
  }

  if (role === 2 || role === "2" || role === "proveedor") {
    return "proveedor";
  }

  if (role === 3 || role === "3" || role === "administrador") {
    return "administrador";
  }

  return "usuario";
};

const ProfileCard = ({ onClose }) => {
  const { authState } = useContext(AuthContext);
  const user = authState?.user || {};

  const role = getRole(user);
  const isBuyer = role === "comprador";
  const invitationCode = getInvitationCode(user);

  const profileImage =
    user?.UrlLogoEmpresa && user.UrlLogoEmpresa !== "no-img.jpeg"
      ? user.UrlLogoEmpresa
      : "user_icon.png";

  const handleCopy = () => {
    if (!invitationCode) return;

    navigator.clipboard
      .writeText(invitationCode)
      .then(() => alert("¡Código copiado!"))
      .catch((err) => console.error("Error al copiar:", err));
  };

  const handleShare = async () => {
    if (!invitationCode) return;

    if (!navigator.share) {
      alert("Tu navegador no soporta esta función.");
      return;
    }

    try {
      await navigator.share({
        title: "Únete a Suplaier",
        text: `Usa mi código para unirte a Suplaier: ${invitationCode}`,
        url: window.location.origin,
      });
    } catch (err) {
      console.error("Error al compartir:", err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="profile-card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>

        <img src={profileImage} alt="Foto de perfil" className="perfil-foto" />

        <h3>{user?.Nombre || "Usuario"}</h3>

        <p className="profile-card-modal__role">
          {role === "comprador"
            ? "Comprador"
            : role === "proveedor"
            ? "Proveedor"
            : role === "administrador"
            ? "Administrador"
            : "Usuario"}
        </p>

        {isBuyer && (
          <div className="codigo-referido-box">
            <span
              className="material-symbols-rounded"
              onClick={handleCopy}
              style={{ cursor: invitationCode ? "pointer" : "not-allowed" }}
              title="Copiar código"
            >
              content_copy
            </span>

            <span>{invitationCode || "Sin código"}</span>

            <span
              className="material-symbols-rounded"
              onClick={handleShare}
              style={{ cursor: invitationCode ? "pointer" : "not-allowed" }}
              title="Compartir código"
            >
              share
            </span>
          </div>
        )}

        <div className="profile-card-modal__info">
          <p>Tel: {user?.Numero || "No registrado"}</p>
          <p>Email: {user?.Email || "No registrado"}</p>
          <p>País: {user?.Pais || "No registrado"}</p>
          <p>Ciudad: {user?.Ciudad || "No registrado"}</p>
          <p>Dirección: {user?.Direccion || "No registrada"}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileCard);