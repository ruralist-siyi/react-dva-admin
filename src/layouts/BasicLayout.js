import React from 'react';
import {Button} from 'antd';
class BasicLayout extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        basicLayout
        <Button type="primary">Primary</Button>
      </div>
    )
  }
}

export default BasicLayout;