import styled from "styled-components";

export const Article = styled.div`
  background-color: #d9d9d9;
  padding: 10px;
`;

export const Section = styled.section`
    margin: auto;
   // background-color: #d9d9d9;
    display: flex;
    flex-direction: row
    justify-content: space-between;
    
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 32%;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: row;
  margin: 3px 0;
`;

export const Label = styled.div`
  width: 180px;
  margin-left: 10px;
  font-size: 14px;
`;

export const SearchButtons = styled.div`
  display: flex;
  flex-direction: end;
  justify-content: flex-end;
  margin-right: 120px;
`;

export const SearchFormTitle = styled.div`
  font-family: Brown-Pro-Bold, Arial, Helvetica, sans-serif;
  border-bottom: 1px solid #e1e2e3;
  color: #2f3132;
  font-size: 36px;
  line-height: 42px;
  font-weight: 500;
  letter-spacing: 1px;
  padding-bottom: 5px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const SubTitle = styled.div`
  font-family: Brown-Pro-Light, Arial, Helvetica, sans-serif;
  border-bottom: 1px solid #e1e2e3;
  color: #2f3132;
  font-size: 30px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 10px;
`;

export const LoadingButton = styled.button`
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
`;
