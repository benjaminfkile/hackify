import React, { Component } from 'react';

class Decoder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // serverURL: 'http://localhost:8000/downloadmp3?url=',
      serverURL: 'https://frozen-thicket-30265.herokuapp.com/downloadmp3?url=',
      interval: 1000,
      duration: null,
      progress: 0
    }
  }

  nextCallback = () => {
    this.props.next()
  }

  render() {

    return (
      <div className="Media_Player">
        <audio id="audio" src={this.state.serverURL + this.props.videoId} onEnded={this.nextCallback} controls autoPlay/>
      </div>
    );
  }
}

export default Decoder;