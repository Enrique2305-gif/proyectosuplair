import React from "react";
import { render, act } from "@testing-library/react";
import { MainCompPage } from "../../compradores/pages/MainCompPage";
import { AuthContext } from "../../auth";
import { BrowserRouter } from "react-router-dom";

describe("MainCompPage", () => {
  // Guardar la implementación original de fetch
  const originalFetch = global.fetch;

  // Antes de todas las pruebas, configura un mock para fetch
  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ rows: [] }) // Simula una respuesta de la API vacía
    }));
  });

  // Después de todas las pruebas, restaura el mock de fetch a su estado original
  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("debería renderizar el componente sin errores", async () => {
    const mockAuthState = {
      authState: {
        user: {
          Rol: "comprador",
        },
      },
    };
    await act(async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthState}>
          <MainCompPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    });
    // Agrega aquí tus aserciones, si las necesitas
  });
});
