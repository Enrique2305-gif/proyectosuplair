import { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";

export default function CanjearInvitacion({ userId }) {
  const [codigo, setCodigo] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [estrellas, setEstrellas] = useState(100);
  const [cargando, setCargando] = useState(false);

  const onCanjear = async () => {
    const limpio = codigo.trim();
    if (!limpio || !userId || cargando) return;

    setCargando(true);
    try {
      const r = await fetch(`${apiUrl}/recompensas/canjear-invitacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: limpio }),
      });
      const data = await r.json();

      if (!data.ok) {
        alert(data.message || "No se pudo canjear el código");
        return;
      }

      const llave = `inviteAwardShown:${userId}:${limpio}`;
      if (data.award?.type === "invite" && !localStorage.getItem(llave)) {
        setEstrellas(data.award.stars ?? 100);
        setAbierto(true);                 // << abre el modal
        localStorage.setItem(llave, "1");
      } else if (!data.award) {
        alert(data.message || "El código ya fue canjeado");
      }
      setCodigo("");
    } catch (e) {
      console.error(e);
      alert("Error de red");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* UI de canje */}
      <div className="flex gap-2 items-center">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de invitación"
          className="border rounded px-3 py-2"
        />
        <button
          onClick={onCanjear}
          disabled={cargando}
          className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
        >
          {cargando ? "Canjeando..." : "Canjear"}
        </button>
      </div>

      {/* Modal inline */}
      <ModalRecompensa
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        estrellas={estrellas}
      />
    </>
  );
}

/* --- Modal interno (mismo archivo) --- */
function ModalRecompensa({ abierto, onCerrar, estrellas = 100 }) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const onFondo = (e) => e.target === e.currentTarget && onCerrar();

  return (
    <div
      onClick={onFondo}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Recompensa por invitación"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[min(92vw,480px)] text-center">
        <div className="text-4xl mb-2">⭐</div>
        <h2 className="text-xl font-semibold mb-1">
          ¡Obtuviste {estrellas} Estrellas!
        </h2>
        <p className="text-gray-700">Gracias a tu código de invitación.</p>
        <p className="text-gray-500 text-sm mt-1">
          Canjéalas con descuentos en tus próximas compras.
        </p>
        <button
          onClick={onCerrar}
          className="mt-5 px-5 py-2 rounded-lg bg-emerald-600 text-white hover:opacity-90"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
