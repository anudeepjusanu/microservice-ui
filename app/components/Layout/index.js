import React, {useState, useRef} from "react";
import Header from "components/Header";
import "./styles.css";
const Layout = (props) => {
  const childRef = useRef();

  // const clicked = () => {
  //   pendingApprovals.pendingApprovals();
  // }

  return (
    <div style={{ overflowX: "hidden" }}>
      <Header ref={childRef}/>
      <div onClick={()=>childRef.current.pendingApprovals()} className="Content">{props.children}</div>
      <div className="Footer ThemeGrid_Wrapper">
        <div className="ThemeGrid_Container">
          <div id="HendrixTheme_wt63_block_wtFooter" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
