import React, { Component } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { getChannelGroupingParent } from "services/goldenSearchService";

class TypeAheadRemote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      text: props.value || "",
      showClearIcon: false,
    };
  }

  onTextChange = (e) => {
    //const { items } = this.props;
    //let suggestions = [];
    const value = e.target ? e.target.value : '';
    this.setState(() => ({
      //suggestions,
      text: value,
    }));
   // if (value.length > 2) {
      getChannelGroupingParent(value).then((res) => {
        let suggestions = [];
        if (res && res.data && res.data.channelGroupingParents) {
          _.each(res.data.channelGroupingParents, (arr) => {
            suggestions.push(arr.LOGITECH_PARTY_NAME);
          });
        }
        this.setState(() => ({
          suggestions,
          //text: value,
        }));
      });
    //}
  };

  onDblClick = () => {
    console.log('lllllll')
    this.onTextChange('');
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
    if (!suggestions || suggestions.length === 0) {
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
    this.props.clearText();
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
      <div className="TypeAheadRemote">
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

export default TypeAheadRemote;
