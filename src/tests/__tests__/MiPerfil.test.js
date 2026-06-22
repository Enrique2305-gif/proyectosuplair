import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthContext } from '../../auth';
import { MiPerfil } from '../../compradores/pages/MiPerfil';

jest.mock('firebase/app', () => {
    return {
      messaging: jest.fn(() => ({
        onMessage: jest.fn(),
        // ... otras funciones que necesitas simular
      })),
      // ... otros servicios de Firebase que estás utilizando
    };
  });
// Mock child components if necessary
jest.mock('../../components/cont_menu/ContMenu', () => ({
    ContMenu: () => <div>Mock ContMenu</div>
  }));
  
  jest.mock('../../compradores/components/ProdDemandaButtonBox', () => ({
    ProdDemandaButtonBox: () => <div>Mock ProdDemandaButtonBox</div>
  }));
// ...mock other child components similarly...

describe('MiPerfil', () => {
  const mockUser = {
    Nombre: 'John Doe',
    Pais: 'Wonderland',
    Ciudad: 'Fantasy City',
    Numero: '1234567890',
    Direccion: '123, Imagination Road',
    Email: 'john@example.com',
  };
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
  it('should render with user data', async() => {
    await act(async () => {
    render(
      <AuthContext.Provider value={{ authState: { user: mockUser } }}>
        <MiPerfil />
      </AuthContext.Provider>
    );
    });
    expect(screen.getByText(/Mi perfil: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/País: Wonderland/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciudad: Fantasy City/i)).toBeInTheDocument();
    // ... more assertions for user data ...

    // Check for child components
    expect(screen.getByText('Mock ContMenu')).toBeInTheDocument();
    expect(screen.getByText('Mock ProdDemandaButtonBox')).toBeInTheDocument();
    // ... more assertions for child components ...
  });
});
