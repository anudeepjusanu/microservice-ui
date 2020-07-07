import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './selectBoxStyles.css'
function SelectBox (props) {

    return (
      <Dropdown 
        options={props.data} 
        onChange={props.onSelect} 
        value={props.defaultOption} 
        placeholder="" 
        id={props.id}/>
    );
}

export default SelectBox;


//****** How TO USE***** */ 

// const options = [
//   { value: 'one', label: 'One' },
//   { value: 'two', label: 'two' },
//   { value: 'three', label: 'three' },
// ];
// const _onSelect = (event) => {
//   console.log("event", event)
// }
// <SelectBox
//         data={options}
//         onSelect={_onSelect}
//         defaultOption={options[0]}
// ></SelectBox>