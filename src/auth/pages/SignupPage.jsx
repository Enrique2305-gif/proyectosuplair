import React, { useState } from "react";
import { Link } from "react-router-dom";

// IMPORTA TUS FORMULARIOS AQUÍ (Ajusta la ruta si es necesario)
import { FormRegistrarComprador } from "../components/FormRegistrarComprador";
import { FormRegistrarProveedor } from "../components/FormRegistrarProveedor";

export const SignupPage = () => {
  // Estado para controlar qué formulario ver: 'comprador' o 'proveedor'
  const [role, setRole] = useState("comprador");

  return (
    <div className="signup-page animate__animated animate__fadeIn">
      
      {/* 1. SECCIÓN FORMULARIO (IZQUIERDA) */}
      <div className="signup-page__form-section">
        <div className="signup-page__card">
          
          <div className="signup-page__header">
            <Link to="/login">
                <img src="/suplaier_logo celeste.png" alt="Suplaier" />
            </Link>
            <h2>Crea tu cuenta gratuita</h2>
            <p className="paragraph paragraph--sm paragraph--grey">
              Completa tus datos para comenzar a operar
            </p>
          </div>

          {/* TOGGLE DE ROL */}
          <div className="signup-page__role-selector">
            <button
                className={`signup-page__role-btn ${role === 'comprador' ? 'signup-page__role-btn--active' : ''}`}
                onClick={() => setRole('comprador')}
            >
                <span className="material-symbols-rounded">shopping_bag</span>
                Comprador
            </button>
            <button
                className={`signup-page__role-btn ${role === 'proveedor' ? 'signup-page__role-btn--active is-provider' : ''}`}
                onClick={() => setRole('proveedor')}
            >
                <span className="material-symbols-rounded">storefront</span>
                Proveedor
            </button>
          </div>

          {/* RENDERIZADO CONDICIONAL */}
          <div className="animate__animated animate__fadeIn">
            {role === "comprador" ? (
                // Aquí se carga tu componente de formulario de Comprador
                <FormRegistrarComprador />
            ) : (
                // Aquí se carga tu componente de formulario de Proveedor
                <FormRegistrarProveedor />
            )}
          </div>

          <div style={{textAlign: 'center', marginTop: '3rem', borderTop: '1px solid #EDF2F7', paddingTop: '2rem'}}>
             <p className="paragraph paragraph--sm">
                ¿Ya tienes una cuenta? <Link to="/login" className="btn-text">Inicia sesión</Link>
             </p>
          </div>

        </div>
      </div>

      {/* 2. SECCIÓN IMAGEN (DERECHA) */}
      <div className="signup-page__image-section">
        <div>
            <h1>
                {role === 'comprador' 
                    ? "Encuentra los mejores precios para tu negocio." 
                    : "Expande tu red de clientes mayoristas."}
            </h1>
            
            <ul>
                {role === 'comprador' ? (
                    <>
                        <li>Acceso a catálogo exclusivo</li>
                        <li>Gestión de pedidos en tiempo real</li>
                        <li>Proveedores verificados</li>
                    </>
                ) : (
                    <>
                        <li>Publica tus productos sin límite</li>
                        <li>Gestión de inventario inteligente</li>
                        <li>Pagos seguros y rápidos</li>
                    </>
                )}
            </ul>
        </div>
      </div>

    </div>
  );
};