import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: null,
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getFetch = async () => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        hasError: null,
      }));

      try {
        const resp = await fetch(url, { signal: controller.signal });
        if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.statusText}`);
        const data = await resp.json();

        if (isMounted) {
          setState({
            data,
            isLoading: false,
            hasError: null,
          });
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          setState({
            data: null,
            isLoading: false,
            hasError: error.message || "No se pudo cargar la información",
          });
        }
      }
    };

    if (url) getFetch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
  };
};
