import styled from "styled-components";

export const ButtonLargeTag = styled.button`
  text-transform: uppercase;
  color: #808080;
  font-weight: 500;
  font-size: 17px;
  padding: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    color: #999;
    border: none;
  }
`;

export const ButtonFilledTag = styled.button`
  text-transform: uppercase;
  color: #ffff00;
  font-weight: 500;
  background-color: black;
  border: 1px solid black;
  cursor: pointer;
  margin-right: 20px;
  height: 32px;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 32px;
  line-height: 30px;
  margin-left: 10px;
  min-width: 80px;
  padding: 0 15px;
  text-align: center;
  & :hover {
    background-color: #ffff00;
    color: black;
    border: 1px solid black;
  }&:disabled {
    background-color: #ccc;
    color: #999;
    border: none;
  }

`;

export const ButtonOutLineTag = styled.button`
  background-color: #fff;
  color: #2f3132;
  text-transform: uppercase;
  border-color: #2f3132;
  border-width: 1px;
  border-style: solid;
  text-shadow: none;
  border: 1px solid #999;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 32px;
  line-height: 30px;
  margin-left: 10px;
  min-width: 80px;
  padding: 0 15px;
  text-align: center;
  text-decoration: none;
  & :hover {
    background-color: black;
    color: #fff;
    border: 1px solid black;
  }&:disabled {
    background-color: #ccc;
    color: #999;
    border: none;
  }
`;

export const ButtonRejectTag = styled.button`
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  background-color: #b32d00;
  border: 1px solid #b32d00;
  cursor: pointer;
  height: 32px;
  margin-right: 20px;
  line-height: 30px;
  min-width: 80px;
  padding: 0 15px;
  & :hover {
    background-color: #fff;
    color: black;
    border: 1px solid black;
  }&:disabled {
    background-color: #ccc;
    color: #999;
    border: none;
  }
`;
