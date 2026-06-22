import { useEffect, useState } from "react"
import { getTokenUser } from "../../firebase/firebaseInit";

export const Notificaciones = () => {

  const [, setIsTokenFound] = useState(false);

  useEffect(() => {
    let data; 
    async function tokenFunc() {
      data = await getTokenUser(setIsTokenFound);
      if (data) {
        console.log("Notificacion token.", data)
      }
      return data;
    }

    tokenFunc();
  }, [setIsTokenFound])

  return (
    <></>
  )
}
