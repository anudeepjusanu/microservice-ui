import styled from "styled-components";

export const Section = styled.section`
    margin: auto;
    display: flex;
    flex-direction: row
    justify-content: space-between;
   padding:10px;
`;

export const FormColumn = styled.div`
  width: 32%;
  display: flex;
  flex-direction: column;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: row;
  margin: 3px 0;
`;

export const Label = styled.div`
  width: 180px;
  margin-left: 20px;
  font-size: 14px;
`;

export const SearchButtons = styled.div`
  display: flex;
  flex-direction: end;
  justify-content: flex-end;
  margin-right: 56px;
`;

export const Article = styled.div`
  background-color: #d9d9d9;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

export const Button = styled.button`
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
`;
