import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { InputElement, ClearIcon, EditIcon } from "./InputStyles";

function Input(props) {
  const [showClearIcon, fnShowClearIcon] = useState(false);
  const showIcon = (e) => {
    if (props.showClearIcon) {
      fnShowClearIcon(true);
    }
  };
  const HideIcon = () => {
    setTimeout(() => {
      fnShowClearIcon(false);
    }, 400);
  };

  return (
    <InputElement>
      <input
        style={{ width: props.width, height: props.height }}
        value={props.value}
        onFocus={showIcon}
        onBlur={HideIcon}
        onChange={props.onTextChange}
        disabled={props.disabled}
        readOnly={props.readOnly || false}
      />
      {showClearIcon && (
        <ClearIcon>
          <FontAwesomeIcon onClick={props.clearText} icon={faTimes} />
        </ClearIcon>
      )}
      {props.showEditIcon && (
        <EditIcon>
          <FontAwesomeIcon icon={faPencilAlt} onClick={props.Edit} />
        </EditIcon>
      )}
    </InputElement>
  );
}

export default Input;
