import React from 'react';
import { render } from '@testing-library/react';
import { AuthContext } from '../../auth';
import {ContMenu} from '../../components/cont_menu/ContMenu';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ContMenu', () => {
  // Test para usuario que no es proveedor
  it('debería mostrar ContListaMenu y ContListaDemands para usuarios no proveedores', () => {
    const mockAuthState = {
      authState: {
        user: {
          Rol: 'comprador', 
        },
      },
    };

    const { getByText } = render(
      <Router>
        <AuthContext.Provider value={mockAuthState}>
          <ContMenu />
        </AuthContext.Provider>
      </Router>
    );

    expect(getByText("Menú de ofertas")).toBeInTheDocument();
    expect(getByText("Menú de demandas")).toBeInTheDocument();
  });

  // Test para usuario proveedor
  it('debería mostrar ContListaMenu y ContListaDemandsProv para usuarios proveedores', () => {
    const mockAuthState = {
      authState: {
        user: {
          Rol: 'proveedor', 
        },
      },
    };

    const { getByText } = render(
      <Router>
        <AuthContext.Provider value={mockAuthState}>
          <ContMenu />
        </AuthContext.Provider>
      </Router>
    );

    expect(getByText("Menú de ofertas")).toBeInTheDocument();
    expect(getByText("Menú de demandas")).toBeInTheDocument();
  });
});
