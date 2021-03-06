import React, { useState } from "react";
import {
  format,
  startOfMonth,
  subMonths,
  addMonths,
  subYears,
  addYears,
  getDaysInMonth,
  getDay,
  endOfMonth,
  setDate,
  getDate,
  isEqual,
  subWeeks,
  addWeeks,
  subDays,
  addDays,
} from "date-fns";
import { chunk } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import "./datepicker.css";

const Calendar = ({ date, handleSelectDate, closeCalendar }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(date));

  const [hoveredDate, sethoveredDate] = useState("Select Date");

  const setPreviousMonth = () => {
    const previousMonth = subMonths(selectedDate, 1);
    setSelectedDate(startOfMonth(previousMonth));
  };

  const setNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(startOfMonth(nextMonth));
  };

  const setPreviousYear = () => {
    const previousYear = subYears(selectedDate, 1);
    setSelectedDate(startOfMonth(previousYear));
  };

  const setNextYear = () => {
    const nextYear = addYears(selectedDate, 1);
    setSelectedDate(startOfMonth(nextYear));
  };

  const handleKeyPress = (e, cb) => {
    const charCode = e.charCode;
    if (charCode === 13 || charCode === 32) {
      cb();
    }
  };

  const setPreviousDay = () => {
    const previousDay = subDays(selectedDate, 1);
    setSelectedDate(previousDay);
  };

  const setNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
  };

  const setPreviousWeek = () => {
    const previousWeek = subWeeks(selectedDate, 1);
    setSelectedDate(previousWeek);
  };

  const setNextWeek = () => {
    const nextWeek = addWeeks(selectedDate, 1);
    setSelectedDate(nextWeek);
  };

  const setDatePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const setDateNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const setDatePreviousYear = () => {
    setSelectedDate(subYears(selectedDate, 1));
  };

  const setDateNextYear = () => {
    setSelectedDate(addYears(selectedDate, 1));
  };

  const setMonthStart = () => {
    setSelectedDate(startOfMonth(selectedDate));
  };

  const setMonthEnd = () => {
    setSelectedDate(endOfMonth(selectedDate));
  };

  const setToday = () => {
    setSelectedDate(new Date());
    const dateString = format(new Date(), "MM-dd-yyyy");
    handleSelectDate(dateString);
    //closeCalendar();
  };

  const generateMonth = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const startWeekday = getDay(startOfMonth(selectedDate));
    const endWeekday = getDay(endOfMonth(selectedDate));
    const gridDays = chunk(
      [
        ...Array.from({ length: startWeekday }).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) =>
          setDate(selectedDate, i + 1)
        ),
        ...Array.from({ length: 6 - endWeekday }).fill(null),
      ],
      7
    );
    return gridDays;
  };

  const handleTableKeyPress = (e) => {
    const keyCode = e.keyCode;
    // Check if control key was pressed
    // const control = e.ctrlKey;
    const control = e.shiftKey;
    switch (keyCode) {
      case 13: //Enter
        handleSelectDate(format(selectedDate, "MM-dd-yyyy"));
        return;
      case 27: //Esc
        closeCalendar();
        return;
      case 32: //Space
        handleSelectDate(format(selectedDate, "MM-dd-yyyy"));
        return;
      case 33: //Page Up
        control ? setDatePreviousYear() : setDatePreviousMonth();
        return;
      case 34: //Page Down
        control ? setDateNextYear() : setDateNextMonth();
        return;
      case 35: //End
        setMonthEnd();
        return;
      case 36: //Home
        setMonthStart();
        return;
      case 37: //Left
        setPreviousDay();
        return;
      case 38: //Up
        setPreviousWeek();
        return;
      case 39: //Right
        setNextDay();
        return;
      case 40: //Down
        setNextWeek();
        return;
      default:
        return;
    }
  };

  const handleDateSelection = (date) => {
    const dateString = format(date, "MM-dd-yyyy");
    handleSelectDate(dateString);
  };

  const hoveredDatefn = (e) => {
    formatDate(e);
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    sethoveredDate([year, month, day].join("-"));
  };

  return (
    <div className="calendar">
      <div className="title">
        <div className="selectedDate">
          <div className="month" role="heading">
            {format(selectedDate, "MMMM yyyy")}
          </div>
        </div>
        <div className="selectedDate header-label">
          <div className="icons">
            <div
              className="iconContainer"
              tabIndex="0"
              onClick={setPreviousYear}
              onKeyPress={(e) => handleKeyPress(e, setPreviousYear)}
              role="button"
              aria-label="Previous year"
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </div>
            <div
              className="iconContainer"
              tabIndex="0"
              onClick={setPreviousMonth}
              onKeyPress={(e) => handleKeyPress(e, setPreviousMonth)}
              role="button"
              aria-label="Previous month"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
          </div>
          <div onClick={setToday} className="todayDate">
            Today
          </div>
          <div className="icons">
            <div
              className="iconContainer"
              tabIndex="0"
              onClick={setNextMonth}
              onKeyPress={(e) => handleKeyPress(e, setNextMonth)}
              role="button"
              aria-label="Next year"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div
              className="iconContainer"
              tabIndex="0"
              onClick={setNextYear}
              onKeyPress={(e) => handleKeyPress(e, setNextYear)}
              role="button"
              aria-label="Next year"
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </div>
          </div>
        </div>
      </div>
      <table
        id="grid"
        tabIndex="0"
        onKeyDown={handleTableKeyPress}
        role="grid"
        aria-label="Month"
        className="calenderGrid"
      >
        <thead>
          <tr role="row">
            <th
              className="Theader holiday"
              role="columnheader"
              aria-label="Sunday"
            >
              <abbr title="Sunday">Sun</abbr>
            </th>
            <th className="Theader" role="columnheader" aria-label="Monday">
              <abbr title="Monday">Mon</abbr>
            </th>
            <th className="Theader" role="columnheader" aria-label="Tuesday">
              <abbr title="Tuesday">Tue</abbr>
            </th>
            <th className="Theader" role="columnheader" aria-label="Wednesday">
              <abbr title="Wednesday">Wed</abbr>
            </th>
            <th className="Theader" role="columnheader" aria-label="Thursday">
              <abbr title="Thursday">Thu</abbr>
            </th>
            <th className="Theader" role="columnheader" aria-label="Friday">
              <abbr title="Friday">Fri</abbr>
            </th>
            <th
              className="Theader holiday"
              role="columnheader"
              aria-label="Saturday"
            >
              <abbr title="Saturday">Sat</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {generateMonth().map((week, i) => (
            <tr className="week" key={`week-${i}`} role="row">
              {week.map((day, i) =>
                day ? (
                  <td
                    className={`cell${
                      isEqual(selectedDate, day) ? " active" : ""
                    }`}
                    key={`day-cell-${i}`}
                    onClick={() => handleDateSelection(day)}
                    role="gridcell"
                    aria-selected={isEqual(selectedDate, day)}
                    onMouseEnter={() => hoveredDatefn(day)}
                  >
                    {getDate(day)}
                  </td>
                ) : (
                  <td className="empty" key={`day-cell-${i}`}>
                    &nbsp;
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="date-label">{hoveredDate}</div>
    </div>
  );
};

export default Calendar;
