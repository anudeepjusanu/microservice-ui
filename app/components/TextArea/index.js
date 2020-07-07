import React, { useState } from "react";

function TextArea(props) {
  const [textareaVAlue, fnSetValue] = useState("");
  const handleChange = (event) => {
    fnSetValue(event.target.value);
    if (props.changeFunc) {
      props.changeFunc(event.target.value);
    }
  };
  return (
    <textarea
      value={textareaVAlue}
      cols={props.cols}
      rows={props.rows}
      onChange={handleChange}
    />
  );
}

export default TextArea;
