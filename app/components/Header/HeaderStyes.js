
import styled from 'styled-components';

export const HeaderContainer = styled.div`
    font-weight: normal;
    font-family: Brown-Pro-Regular, Arial, Helvetica, sans-serif;
    line-height: 1.43;
    box-sizing: border-box;
    font-size: 100%;
    color: #fff;
    position: fixed;
    top: 0;
    text-align: center;
    background-color: #00B8FC;
    padding-bottom: 10px;
    width: 100vw;
    margin: auto;
    z-index:100
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 5%;
    margin: auto;
`;

export const Title = styled.div`
    font-size: 30px;
    line-height:30px;
    font-weight: 600;
    text-transform: lowercase;
`;

export const User = styled.span`
    padding: 0 2px;
`;

export const Count = styled.div`
text-decoration: none;
padding: 0 10px`;

export const PendingApprovalList = styled.div`
    position: absolute;
    background-color: black;
    color: white;
    top: 25px;
    min-width: 350px;
`;

export const Item = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    font-size: 15px;
`;

export const Name = styled.div`
`;
export const Number = styled.div`
`;