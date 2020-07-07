import React, { Component } from "react";
import "./TypeAheadDropDown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

class TypeAheadDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      text: props.value || "",
      showClearIcon: false,
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return {
  //    show: nextProps.show,
  //   };
  //  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.props.value == "") {
      this.setState(() => ({
        suggestions: [],
        text: "",
      }));
    }
  }

  onTextChange = (e) => {
    const { items } = this.props;
    let suggestions = [];
    const value = e.target.value;
    if (value.length > 0) {
      //const regex = new RegExp(`^${value}`, `i`);
      //suggestions = items.sort().filter((v) => v.includes(value));
      // const sp = _.some(items, function(el) {
      //   return el.toLowerCase() === value;
      // });
      suggestions = _.filter(items, function(o) {
        return o.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
    }
    this.setState(() => ({
      suggestions,
      text: value,
    }));
  };

  onDblClick = () => {
    this.setState(() => ({
      suggestions: this.props.items,
    }));
  };

  suggestionSelected = (value) => {
    this.setState(() => ({
      text: value,
      suggestions: [],
    }));
    this.props.onSelect(value);
    this.hideIcon();
  };

  renderSuggestions = () => {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul className="suggestionsList">
        {suggestions.map((item) => (
          <li key={item} onClick={(e) => this.suggestionSelected(item)}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  showIcon = () => {
    this.setState({ showClearIcon: true });
  };
  hideIcon = () => {
    this.setState({ showClearIcon: false });
  };

  clearValue = (e) => {
    e.stopPropagation();
    this.setState({
      text: "",
      suggestions: [],
    });
    this.hideIcon();
    if (this.props.clearText) {
      this.props.clearText();
    }
  };
  clearSuggestions = () => {
    setTimeout(() => {
      this.setState({
        suggestions: [],
      });
      this.hideIcon();
    }, 300);
  };

  render() {
    const { text } = this.state;
    return (
      <div className="TypeAheadDropDown">
        <input
          placeholder={this.props.placeholder}
          onBlur={this.clearSuggestions}
          style={{ width: this.props.width, height: this.props.height }}
          onFocus={this.showIcon}
          onChange={this.onTextChange}
          onDoubleClick={this.onDblClick}
          value={text}
          type="text"
        />
        {this.state.showClearIcon && (
          <span className="clearIcon" onClick={this.clearValue}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
        {this.renderSuggestions()}
      </div>
    );
  }
}

export default TypeAheadDropDown;
