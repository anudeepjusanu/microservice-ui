import styled from "styled-components";

export const SearchFormTitle = styled.div`
  font-size: 36px;
  line-height: 42px;
  font-family: Brown-Pro-Bold, Arial, Helvetica, sans-serif;
  font-weight: 500;
  margin-top: 20px;
  position: relative;
  margin-bottom: 10px;
  border-bottom: 1px solid #e1e2e3;
`;

export const Article = styled.article`
  overflow-x: hidden;
  padding-left: 5%;
  padding-right: 5%;
`;

export const A = styled.a`
  color: #00b8fc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const Button = styled.button`
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
  font-size: 12px;
`;

export const ExportExcel = styled.span`
  display: block;
  text-align: right;
  margin-bottom:15px;
  color: #00B8FC;
  cursor: pointer;
  &: hover {
    text-decoration: underline;
  }
`;