import React, { useState, useImperativeHandle, forwardRef } from "react";
import { format } from "date-fns";
import Datepicker from "./datepicker";
import Calendar from "./calendar";

const DatePicker = forwardRef((props, ref) => {
  const [showDatepicker, setShowDatePicker] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(
    props.value || format(new Date(), "MM-dd-yyyy")
  );

  const toggleCalendar = (e) => {
    setShowCalendar(!showCalendar);
  };

  const handleSelectDate = (date) => {
    setDate(date);
    setShowDatePicker(true);
    setShowCalendar(false);
    props.onChange(date);
  };

  const closeCalendar = () => {
    setShowDatePicker(true);
    setShowCalendar(false);
  };

  useImperativeHandle(ref, () => ({
    closeCalendar() {
      setShowCalendar(false);
    }
  }));

  return (
    <div className="picker" role="application">
      {showDatepicker && (
        <Datepicker date={date} handleSelect={toggleCalendar} />
      )}
      {showCalendar && (
        <Calendar
          date={date}
          handleSelectDate={handleSelectDate}
          closeCalendar={closeCalendar}
        />
      )}
    </div>
  );
});

export default DatePicker;
