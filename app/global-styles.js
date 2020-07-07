import { createGlobalStyle, injectGlobal } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: Brown-Pro-Regular, Arial, Helvetica, sans-serif;
  }

  body.fontLoaded {
    font-family: Brown-Pro-Regular, Arial, Helvetica, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p {
    font-family: Brown-Pro-Regular, Arial, Helvetica, sans-serif;
    line-height: 1.5em;
  }

  .header{
    background-color: #00B8FC;
    color: #fff;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    text-align: center;
  }
  .header_name{
    text-align:center;
  }
  .ThemeGrid_Container {
    padding-left: 5%;
    padding-right: 5%;
}
.Application_Title {
  overflow: hidden;
  font-size: 30px;
  text-transform: lowercase;
  letter-spacing: -1px;
  line-height: 30px;
  padding-top: 15px;
}
.Application_Title a, .Application_Title a:link, .Application_Title a:visited, .Application_Title a:hover {
  color: #fff;
  text-decoration: none;
}
.CompanyLogo {
  float: left;
  background-image: url(images/logo.png);
  background-repeat: no-repeat;
  background-position: center;
}
.Header_Menu, .Application_Menu {
  background-color: #00B8FC;
}
.Content {
  width:100vw;
  margin-bottom: 0;
  min-height: 100%;
  padding-top: 160px;
  padding-bottom: 40px;
}
`;

export default GlobalStyle;
