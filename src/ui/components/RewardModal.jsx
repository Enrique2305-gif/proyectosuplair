import React, { useEffect } from "react";
import { useReward } from "../RewardContext";

const RewardModal = () => {
  const { reward, setReward } = useReward();

  // Bloquea el scroll del body cuando el modal está visible
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (reward.show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [reward.show]);

  const close = () => {
    try {
      reward.onClose?.(); // ejecuta callback si existe
    } catch {}
    setReward((r) => ({ ...r, show: false, onClose: undefined }));
  };

  if (!reward.show) return null;

  return (
    <div
      onClick={close}
      // Backdrop: cubre toda la pantalla y centra el modal
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // Tarjeta: fondo blanco, sombra y tipografía legible
        style={{
          background: "#ffffff",
          color: "#111",
          width: "min(92vw, 520px)",
          maxWidth: 520,
          padding: "24px 28px",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <h3 className="paragraph--bold" style={{ marginTop: 0 }}>
          {reward.title}
        </h3>

        <p className="paragraph" style={{ marginBottom: 12 }}>
          {reward.message}
        </p>

        {reward.stars > 0 && (
          <p className="paragraph" style={{ margin: "8px 0" }}>
            ⭐ Estrellas obtenidas: {reward.stars}
          </p>
        )}

        {reward.balance != null && (
          <p className="paragraph" style={{ margin: "8px 0 0" }}>
            💰 Tu saldo: {reward.balance} estrellas
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button className="btn btn--blue" onClick={close}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
