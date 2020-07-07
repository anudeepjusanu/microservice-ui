import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './tabs.css';

function LogitechTab(props){
    return(
      <div className="LogitechTabs">
      <Tabs>
        <TabList>
          {props.TabHeading.map((tab, index)=>{
            return(<Tab key={index}><a>{tab.name}</a></Tab>)
          })}
        </TabList>
          {
            props.TabBody.map((content, index)=>{
              return(<TabPanel key={index}>{content}</TabPanel>)
            })
          }
      </Tabs>
      </div>
    );
}

  export default LogitechTab;