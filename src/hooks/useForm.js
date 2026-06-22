import {useState} from "react";

export const useForm = (initialForm = {}) => {

  const [formState, setFormState] = useState(initialForm);

  const onInputChange = ({target}) => {
    const {name, value} = target;

    if (name === "urlImg") {
      const url = target.files[0];
      if(!!url) {
        setFormState({
          ...formState,
          [name] : url,
        });
      } else {
        setFormState({
          ...formState,
          [name] : "no-img.jpeg",
        });
      }
      return;
    }

    setFormState({
      ...formState,
      [name] : value,
    });
  }

  const onResetForm = () => {
    setFormState(initialForm);
  }

  const setNameValueEmpty = (campo) => {
    if (campo === "urlImg") {
      setFormState({
        ...formState,
        [campo] : "no-img.jpeg",
      });
    }
  }
  
  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    setNameValueEmpty,
  }

}
