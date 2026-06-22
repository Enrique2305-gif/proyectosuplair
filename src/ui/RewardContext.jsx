import { createContext, useContext, useState, useMemo } from "react";

const RewardContext = createContext(null);

export const RewardProvider = ({ children }) => {
  const [reward, setReward] = useState({
    show: false,
    title: "",
    message: "",
    stars: 0,
    balance: null,
    onClose: null,     // ⬅️ NUEVO
  });

  const value = useMemo(() => ({ reward, setReward }), [reward]);
  return <RewardContext.Provider value={value}>{children}</RewardContext.Provider>;
};

export const useReward = () => {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error("useReward must be used inside <RewardProvider>");
  return ctx;
};
