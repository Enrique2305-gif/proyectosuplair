import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../../auth/context';
import { LoginPage } from '../../auth/pages/LoginPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginPage',  () => {
  const mockLogin = jest.fn();

  beforeEach(async() => {
    await act(async () => {
    render (
      <Router>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </Router>
    );
    });
  });

  it('should render login form', () => {
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('should allow entering username and password', async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    });

    expect(screen.getByLabelText(/Usuario/i).value).toBe('testuser');
    expect(screen.getByLabelText(/Contraseña/i).value).toBe('password123');
  });

  // Add more tests for form submission, API call mocking, validation, and navigation
});

