import React from "react"
import { useEffect, useState } from "react";

export const ProgressBar = ({cantMax, actualProductos}) => {

  const [newWidth, setNewWidth] = useState("");
  const [isFull, setIsFull] = useState(false);

  const changeProgess = () => {

    const newWidth = actualProductos * 100 / cantMax;

    newWidth === 100 && setIsFull(true);

    setNewWidth(newWidth + "%");
  }

  useEffect(() => {

    changeProgess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualProductos])

  return (
    <div className="progressbar">
      <div className="actualProgress" style={
        isFull 
        ? {width: newWidth, borderRadius: "10px"} 
        : {width: newWidth}}>
      </div>
    </div>
  )
}
