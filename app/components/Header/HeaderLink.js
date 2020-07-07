import { Link } from "react-router-dom";
import styled from "styled-components";

export default styled(Link)`
  position: relative;
  display: inline-flex;
  padding: 0.25em 1em;
  margin: 1em;
  text-decoration: none;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: "Brown-Pro-Regular", Arial, Helvetica, sans-serif;
  font-size: 14px;
  color: #fff !important;
  text-decoration: underline;
  text-transform: uppercase;
  &:active {
    background: #41addd;
    color: #fff;
  }
`;
