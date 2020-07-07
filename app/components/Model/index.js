import React from "react";
import Popup from "reactjs-popup";
import "./model.css";

class Model extends React.Component {
  constructor(props) {
    super(props);
    console.log("hh", props);
  }

  render() {
    return (
      <Popup
        open={this.props.open}
        closeOnDocumentClick={false}
        onClose={this.props.closeModal}
      >
        <div className="modal">
          <a className="close" onClick={this.props.closeModal}>
            &times;
          </a>
          <div className="header">
            <span>{this.props.title} </span>
          </div>
          <div className="content">{this.props.children}</div>
          {/* <div className="actions">
            <button className="button" onClick={this.props.closeModal}>
              close
            </button>
            <button className="button"> Update </button>
          </div> */}
        </div>
      </Popup>
    );
  }
}

export default Model;
