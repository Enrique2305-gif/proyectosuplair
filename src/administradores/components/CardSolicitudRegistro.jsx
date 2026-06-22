import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { apiUrl } from "../../apiUrl";
import Modal from 'react-modal'

export const CardSolicitudRegistro = ({solicitud}) => {
    const dateObj = new Date(solicitud.FechaSolicitud);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isModalOpen1, setIsModalOpen1] = useState(false); 
    const openModal = () => {
      setIsModalOpen(true);
      
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      window.location.reload();
    };
    const openModal1 = () => {
      setIsModalOpen1(true);
    };
  
    const closeModal1 = () => {
      setIsModalOpen1(false);
      window.location.reload();
    };
    const onClickSolicitud = () => {
        console.log(solicitud.IdSolicitud)
        console.log(solicitud)
        navigate(`/solicitud/${solicitud.IdSolicitud}`);
      }
    
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
    const onAceptarSolicitud = async() => {
      openModal();
      //const body = solicitud;
      const postresp = await fetch(`${apiUrl}/usuarios`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(solicitud)
      });
      const data = await postresp.json()
      console.log(data);

      const bodySolicitud = { 
        IdSolicitud: solicitud.IdSolicitud,
        Estado: "aprobada", //Id Estado DB
      }
      const resp = await fetch(`${apiUrl}/solicitudRegistro`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodySolicitud)
      });
      const dataSolicitud = await resp.json()
      console.log(!!dataSolicitud && "Aceptando solicitud");

      /*const delresp = await fetch(`http://localhost:4000/api/v1/solicitudregistro/${solicitud.IdSolicitud}`, {
        method: 'DELETE',
      });*/
      
    }
  
    const onRechazarSolicitud = async() => {
      openModal1();
            const bodySolicitud = { 
        IdSolicitud: solicitud.IdSolicitud,
        Estado: "rechazada", //Id Estado DB
      }
      const resp = await fetch(`${apiUrl}/solicitudRegistro`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodySolicitud)
      });
      const dataSolicitud = await resp.json()
      console.log(!!dataSolicitud && "Rechazando solicitud");
      /*const delresp = await fetch(`http://localhost:4000/api/v1/solicitudregistro/${solicitud.IdSolicitud}`, {
        method: 'DELETE',
      });*/
    }

    return (
      <div>
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Label"
        
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            width: '20%',  
      height: '20%', 
      margin: 'auto', 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',

          },
        }}
      >
        
        <div>
        <h2 style={{ fontSize: '200%', fontWeight: 'bold' }}>Solicitud Aceptada</h2>
          
          <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button className="cardSolicitudContainer--botonesBox--btnAceptar"
        onClick={closeModal}
        style={{
          padding: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Ok
      </button>
    </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen1}
        onRequestClose={closeModal1}
        contentLabel="Modal Label"
        
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            width: '20%',  
      height: '20%', 
      margin: 'auto', 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',

          },
        }}
      >
        
        <div>
        <h2 style={{ fontSize: '200%', fontWeight: 'bold' }}>Solicitud Negada</h2>
          
          <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button className="cardSolicitudContainer--botonesBox--btnAceptar"
        onClick={closeModal1}
        style={{
          padding: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Ok
      </button>
    </div>
        </div>
      </Modal>
    
      <div className="cardSolicitudContainer" >
        <div className="cardSolicitudContainer--datosUser" onClick={onClickSolicitud}>
          <p className="paragraph"><b>{solicitud.Nombre}</b></p>
          <p className="paragraph">{solicitud.Email}</p>
          <p className="paragraph">Fecha solicitud: {dateObj.toLocaleString(undefined, options)} </p>
        </div>
        <div className="cardSolicitudContainer--botonesBox">
          <button
            onClick={onAceptarSolicitud}
            className="cardSolicitudContainer--botonesBox--btnAceptar"
          >
            Aceptar
          </button>
         
          <button
            onClick={onRechazarSolicitud}
            className="cardSolicitudContainer--botonesBox--btnRechazar"
          >
            Rechazar
          </button>
        </div>
      </div>
      </div>
      
    )
  }