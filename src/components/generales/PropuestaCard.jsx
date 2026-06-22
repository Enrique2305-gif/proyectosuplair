router.put("/:idPropuesta/estado", function (req, res) {
  const { idPropuesta } = req.params;
  const { Estado } = req.body; // "aceptada" o "rechazada"

  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `SELECT 
          p.*,
          d.IdDemanda,
          d.IdComprador,
          d.Actual,
          d.Cantidad AS CantidadSolicitada,
          pr.Name AS NombreProducto
       FROM Propuesta p
       JOIN Demanda d ON d.IdDemanda = p.IdDemanda
       LEFT JOIN Producto pr ON pr.IdProducto = d.IdProducto
       WHERE p.IdPropuesta = ?`,
      [idPropuesta],
      (err, rows) => {
        if (err) return res.json(err);

        if (!rows || rows.length === 0) {
          return res.status(404).json({ message: "Propuesta no encontrada" });
        }

        const propuesta = rows[0];

        conn.query(
          `UPDATE Propuesta
           SET Estado = ?
           WHERE IdPropuesta = ?`,
          [Estado, idPropuesta],
          (errUpdate) => {
            if (errUpdate) return res.json(errUpdate);

            // Si la propuesta fue aceptada, actualizamos la demanda
            if (Estado === "aceptada") {
              const nuevoActual =
                Number(propuesta.Actual || 0) + Number(propuesta.Cantidad || 0);

              conn.query(
                `UPDATE Demanda
                 SET Actual = ?
                 WHERE IdDemanda = ?`,
                [nuevoActual, propuesta.IdDemanda],
                (errDemanda) => {
                  if (errDemanda) return res.json(errDemanda);

                  // Notificación al proveedor
                  conn.query(
                    `INSERT INTO Notificacion
                    (IdUsuario, IdOferta, IdCompra, Descripcion, FechaCrea, IdTipoNotificacion, Leida)
                    VALUES (?, NULL, NULL, ?, NOW(), ?, 0)`,
                    [
                      propuesta.IdProveedor,
                      `Tu propuesta para la demanda del producto ${propuesta.NombreProducto || ""} fue aceptada.`,
                      3,
                    ],
                    (errNotif) => {
                      if (errNotif) {
                        console.log("Error creando notificación:", errNotif);
                      }

                      return res.json({
                        message: "Propuesta aceptada correctamente",
                        propuesta,
                        nuevoActual,
                      });
                    }
                  );
                }
              );
            } else {
              // Si fue rechazada, también puedes notificar
              conn.query(
                `INSERT INTO Notificacion
                (IdUsuario, IdOferta, IdCompra, Descripcion, FechaCrea, IdTipoNotificacion, Leida)
                VALUES (?, NULL, NULL, ?, NOW(), ?, 0)`,
                [
                  propuesta.IdProveedor,
                  `Tu propuesta para la demanda del producto ${propuesta.NombreProducto || ""} fue rechazada.`,
                  3,
                ],
                (errNotif) => {
                  if (errNotif) {
                    console.log("Error creando notificación:", errNotif);
                  }

                  return res.json({
                    message: "Propuesta rechazada correctamente",
                  });
                }
              );
            }
          }
        );
      }
    );
  });
});