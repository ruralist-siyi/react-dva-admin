import React from 'react';
import {Button} from 'antd';
import memoizeOne from 'memoize-one';
import {connect} from 'dva';

@connect(() => {

})
class BasicLayout extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Button type="primary">Primary</Button>
      </div>
    )
  }
}

export default BasicLayout;