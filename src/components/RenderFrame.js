import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

class RenderFrame extends React.Component {
  render() {
    return (
      <Fragment>
          <div>
            <div>
              <ReactCSSTransitionGroup
                component="div"
                transitionName={this.props.sceneChange ? 'scene' : 'sprite'}
                transitionEnterTimeout={this.props.sceneChange ? 2000 : 400}
                transitionLeaveTimeout={this.props.sceneChange ? 1700 : 300}
              >
                <img key={this.props.bg} className="bg" src={this.props.bg} />
                {this.props.sprite && this.props.sprite.length == 2 ? (
                  <div>
                    <img
                      key={this.props.sprite[0]}
                      className="sprite first-sprite"
                      src={this.props.sprite[0]}
                    />
                    <img
                      key={this.props.sprite[1]}
                      className="sprite second-sprite"
                      src={this.props.sprite[1]}
                    />
                  </div>
                ) : (
                  <img
                    key={this.props.sprite}
                    className="sprite"
                    src={this.props.sprite}
                  />
                )}
              </ReactCSSTransitionGroup>
              {this.props.text && this.props.textBoxShown ? (
                <div className="text-box" onClick={this.props.setNextFrame}>
                  {this.props.speaker ? (
                    <div className="speaker"> {this.props.speaker} </div>
                  ) : null}
                  <div className="text">
                    {this.props.speaker
                      ? '"' + this.props.text + '"'
                      : this.props.text}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
      </Fragment>
    );
  }
}

export default RenderFrame;
