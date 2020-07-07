import styled from "styled-components";

export const Article = styled.div`
  background-color: #d9d9d9;
  margin-bottom: 30px;
  padding-bottom: 20px;
  margin-right: 30px;
  margin-left: 30px;
`;

export const Section = styled.section`
    width: 97vw;
    margin: auto;
   // background-color: #d9d9d9;
    display: flex;
    flex-direction: row
    justify-content: space-between;
    padding-top:20px;
    padding-bottom:10px;
    
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: row;
  margin: 3px 0;
`;

export const Label = styled.div`
  width: 170px;
  margin-left: 10px;
  font-size: 13px;
`;

export const SearchButtons = styled.div`
  display: flex;
  flex-direction: end;
  justify-content: center;
  margin-right: 0px;
`;
