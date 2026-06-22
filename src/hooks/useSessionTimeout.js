import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useSessionTimeout = ({ logout, minutes = 60 } = {}) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const maxInactivityDuration = minutes * 60 * 1000;

  const expireSession = useCallback(() => {
    if (typeof logout === "function") logout();
    navigate("/sesion_expirada", { replace: true });
  }, [logout, navigate]);

  const resetSessionTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(expireSession, maxInactivityDuration);
    localStorage.setItem("lastActivityTime", Date.now().toString());
  }, [expireSession, maxInactivityDuration]);

  useEffect(() => {
    const activityEvents = ["click", "mousemove", "keypress", "scroll", "touchstart"];
    resetSessionTimer();
    activityEvents.forEach((event) => window.addEventListener(event, resetSessionTimer));

    return () => {
      window.clearTimeout(timerRef.current);
      activityEvents.forEach((event) => window.removeEventListener(event, resetSessionTimer));
    };
  }, [resetSessionTimer]);
};
