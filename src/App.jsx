import React from "react";
import { AuthProvider } from "./auth";
import { AppRouter } from "./router/AppRouter";
import { RewardProvider } from "./ui/RewardContext";
import RewardModal from "./ui/components/RewardModal";

export const App = () => (
  <AuthProvider>
    <RewardProvider>
      <AppRouter />
      <RewardModal /> {/* Modal global */}
    </RewardProvider>
  </AuthProvider>
);
