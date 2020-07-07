import React from "react";
import {
  ButtonLargeTag,
  ButtonFilledTag,
  ButtonOutLineTag,
  ButtonRejectTag,
} from "./ButtonStyles";

export const ButtonLarge = (props) => {
  return (
    <ButtonLargeTag disabled={props.disabled}>{props.children}</ButtonLargeTag>
  );
};

export const ButtonFilled = (props) => {
  return (
    <ButtonFilledTag
      style={{ height: props.height }}
      onClick={props.onButtonClick}
      disabled={props.disabled}
    >
      {props.children}
    </ButtonFilledTag>
  );
};

export const ButtonOutLine = (props) => {
  return (
    <ButtonOutLineTag disabled={props.disabled} onClick={props.onButtonClick}>
      {props.children}
    </ButtonOutLineTag>
  );
};

export const ButtonReject = (props) => {
  return (
    <ButtonRejectTag disabled={props.disabled} onClick={props.onButtonClick}>
      {props.children}
    </ButtonRejectTag>
  );
};
