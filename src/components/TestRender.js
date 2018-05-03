import React, { Component } from 'react';

export default class test extends Component {
  render() {
    return (
      <div>
        hi<button onClick={this.props.nextScene}>test</button>
      </div>
    );
  }
}
