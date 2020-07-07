
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

export const Center = styled.div`
    margin-top: 10px;
    text-align: center;
`;

export const Back = styled.div`
    margin-left: 20px;
`;

export const FormLayout = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #d9d9d9;
  padding: 20px;
  margin: 20px;
`;

export const FormColumn = styled.div`
    width: 32%;
    display: flex;
    flex-direction: column
`;

export const FormField = styled.div`
    display: flex;
    flex-direction: row;
    margin: 3px 0;
`;

export const Label = styled.div`
    width: 150px;
    margin-left: 20px;
    font-size: 14px;
`;

export const CommentBoxBtton = styled.div`
    width: 600px;
    float: right;
    margin: 20px;
    display: flex;
    flex-direction: column;
`;

export const Comment = styled.div`
  display: flex;
  flex-direction: row;

`

export const Textarea = styled.textarea`
  width: 400px;
`;

export const SearchButton = styled.div`
  display: flex;
  flex-direction: row;
  float: right;
  justify-content: flex-end;
  margin: 30px;
`