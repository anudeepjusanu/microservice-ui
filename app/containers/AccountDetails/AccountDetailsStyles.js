import styled from "styled-components";

export const Article = styled.article`
  padding-left: 5%;
  padding-right: 5%;
`;
export const ExportToExcel = styled.p`
  text-align: end;
  cursor: pointer;
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 14px;
  color: #999;
`;

export const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
`;

export const A = styled.a`
  color: #00b8fc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const LoadingButton = styled.button`
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
`;
