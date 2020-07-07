import React from 'react';
import Dropdown from 'react-dropdown';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import './CheckboxStyles.css'
function CheckBox (props) {
    return (
        <Checkbox
        name="my-checkbox"
        defaultChecked
        onChange={props.onChange}
        checked={props.checked}
      />
    );
}

export default CheckBox;
