import React from "react";
import "./datepicker.css";
import Input from "./../Input/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const Datepicker = ({ date, handleSelect }) => {
  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode === 13 || charCode === 32) {
      handleSelect();
    }
  };

  return (
    <div
      className="datepicker"
      tabIndex="0"
      onClick={handleSelect}
      onKeyPress={handleKeyPress}
      role="button"
      aria-label="Date picker"
    >
      <Input width="250px" height="30px" value={date} />
      <FontAwesomeIcon
        icon={faCalendarAlt}
        style={{ fontSize: "20px", margin: "3px 5px" }}
      />
    </div>
  );
};

export default Datepicker;
