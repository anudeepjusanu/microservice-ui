import styled from "styled-components";

export const Title = styled.div`
  font-family: Brown-Pro-Light, Arial, Helvetica, sans-serif;
  border-bottom: 1px solid #E1E2E3;
  color: #2F3132;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
  margin:0 20px;
`;

export const AddContactButton = styled.div`
    margin: 20px;
`;

export const FormColumn = styled.div`
   // width: 32%;
    display: flex;
    flex-direction: column
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

export const Article = styled.div`
    background-color: #d9d9d9;
    margin-bottom: 30px;
    padding : 20px;
    margin-right: 30px;
    margin-left: 30px;
 justify-content: space-between
`;

export const FormLayout = styled.div`
  display: flex;
  flex-direction: row
`;

export const SearchButton =  styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
`;

export const BackButton = styled.div`
  text-align:right;
  margin: 10px 30px;
`;