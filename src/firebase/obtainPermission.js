
export const obtainUserPermission = () => {
  Notification.requestPermission()
    .then((permission) => {
      if(permission === "granted"){
        const options = {
          body: "probando notificaciones",
        };
      new Notification(" Posted a comment",options);
      }
    })
}