import React, { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { AuthContext } from "../../auth";
import { useForm } from "../../hooks";
import { AccionExitosa } from "./AccionExitosa";
import { ResumenProducto } from "./ResumenProducto";

export const FormCrearPropuesta = ({ Minimo, Maximo, IdDemanda, cantMax}) => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [showResumenProducto, setShowResumenProducto] = useState(false);
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);
  // Validations
  const [esPrecioValido, setEsPrecioValido] = useState(false);
  const [esCantidadValida, setEsCantidadValida] = useState(false);

  const {
    formState,
    onInputChange,
  } = useForm({
    precio: "",
    cantidad: 1,
  });


  useEffect(() => {
    setEsPrecioValido(
      !isNaN(formState.precio) &&
        parseFloat(formState.precio) >= Minimo &&
        parseFloat(formState.precio) <= Maximo
    );
  }, [formState.precio, Minimo, Maximo]);

  useEffect(() => {
    setEsCantidadValida(formState.cantidad >= 1 && formState.cantidad <= cantMax);
  }, [formState.cantidad, cantMax]);

  const validarTodosCampos = () => {
    return new Promise((resolve, reject) => {
      const regexPrecio = /^([0-9]+(\.[0-9]+)?)$/;

      if (
        regexPrecio.test(formState.precio) &&
        parseFloat(formState.precio) >= Minimo &&
        parseFloat(formState.precio) <= Maximo &&
        formState.cantidad >= 1 &&
        formState.cantidad <= cantMax
      ) {
        resolve(true);
      } else {
        setEsPrecioValido(
          regexPrecio.test(formState.precio) &&
            parseFloat(formState.precio) >= Minimo &&
            parseFloat(formState.precio) <= Maximo
        );
        setEsCantidadValida(formState.cantidad >= 1 && formState.cantidad <= cantMax);
        reject(false);
      }
    });
  };

  const uploadPropuesta = async () => {
    try {
      const body = {
        IdDemanda: IdDemanda, // Assuming dataproducto is available in your component
        IdProveedor: user.IdUsuario,
        Precio: formState.precio, // Use formState to get the precio value
        Cantidad: formState.cantidad, // Use formState to get the cantidad value
        Estado: "Pendiente",
      };

      console.log(body);

      const resp = await fetch(`${apiUrl}/propuestas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setShowResumenProducto(false); // Close the resumenProducto section if the request is successful
        setShowAccionExitosa(true); // Show success message
      } else {
        // Handle errors if needed
        console.error("Error creating propuesta:", resp.statusText);
        // Optionally show an error message to the user
        // You can replace this with your own error handling logic
        alert("Error creating propuesta. Please try again.");
      }
    } catch (error) {
      console.log("Error creating propuesta:", error);
      // Optionally show an error message to the user
      // You can replace this with your own error handling logic
      alert("Error creating propuesta. Please try again.");
    }
  };

  const onContinuarSubirProducto = async (e) => {
    e.preventDefault();

    try {
      await validarTodosCampos();
      await uploadPropuesta();
    } catch (error) {
      console.log("Producto no válido");
      // Optionally show an error message to the user
      // You can replace this with your own error handling logic
      alert("Invalid product. Please check your input and try again.");
    }
  };

  return (
    <form onSubmit={onContinuarSubirProducto}>
      <div className="compraProducto__box">
        <div className="formSubirProducto u-margin-top-small">
          <label
            align="right"
            htmlFor="formSubirProdPrecio"
            className="paragraph--smResp paragraph--bold formSubirProducto__label"
          >
            Precio
          </label>
          <div className="formSubirProducto__inputBox">
            <input
              id="formSubirProdPrecio"
              type="text"
              placeholder={`Ingrese un precio entre ${Minimo} y ${Maximo}`}
              className="formSubirProducto__inputBox__input paragraph"
              name="precio"
              autoComplete="off"
              value={formState.precio}
              onChange={onInputChange}
              required
            />
            {!esPrecioValido && (
              <p className="paragraph--red u-padding-left-small">
                Precio no válido. Debe estar entre {Minimo} y {Maximo}.
              </p>
            )}
          </div>
        </div>
        <div className="formSubirProducto u-margin-top-small">
          <label
            align="right"
            htmlFor="formSubirProdCantidad"
            className="paragraph--smResp paragraph--bold formSubirProducto__label"
          >
            Cantidad
          </label>
          <div className="formSubirProducto__inputBox">
            <input
              id="formSubirProdCantidad"
              type="text"
              placeholder="Cantidad de productos a vender en propuesta"
              className="formSubirProducto__inputBox__input paragraph"
              name="cantidad"
              autoComplete="off"
              value={formState.cantidad}
              onChange={onInputChange}
              required
            />
            {!esCantidadValida && (
              <p className="paragraph--red u-padding-left-small">
                Cantidad no válida. Debe ser al menos 1 y no superar el máximo.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="metodoPago__btnBox">
        <button type="submit" className="btn btn--blue">
          Continuar
        </button>
      </div>
      <div>
        {showResumenProducto && (
          <ResumenProducto
            formState={formState}
            setShowResumenProducto={setShowResumenProducto}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        )}
        {showAccionExitosa && (
          <AccionExitosa
            texto={"¡Propuesta subida con éxito!"}
            setShowAccionExitosa={setShowAccionExitosa}
          />
        )}
      </div>
    </form>
  );
};
