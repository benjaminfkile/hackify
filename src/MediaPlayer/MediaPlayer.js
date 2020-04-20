import React, { Component } from 'react'
import Decoder from '../Decoder/Decoder';
import Bars from './Bars'
import '../MediaPlayer/MediaPlayer.css'

class MediaPlayer extends Component {

    constructor() {
        super();
        this.state = {
            nowPlaying: null,
            queu: null,
            waiting4DB: true,
            idx: 0,
            interval1: 1000,
            pause: false,
            duration: null,
            progress: null,
            shuffle: false,
        }
    }

    componentDidMount() {
        this.listen4DB()
    }
    decoderNext = () => {
        this.next(this.state.queu[this.state.idx])
    }

    decoderDuration = (duration) => {
        if (duration) {
            this.setState({ duration: new Date(duration * 1000).toISOString().substr(12, 7) })


        }
    }
    decoderProgres = (progress) => {
        if (progress) {
            this.setState({ progress: new Date(progress * 1000).toISOString().substr(12, 7) })
        }
    }

    playTrack = (args) => {
        this.setState({ pause: true })
        var audio = document.getElementById("audio");
        if (audio) {
            audio.pause()
        }
        if (args) {
            this.setState(
                {
                    nowPlaying: args.id,
                    idx: args.idx,
                    pause: true
                })
        } else {

            if (this.state.nowPlaying) {
                this.setState({ pause: true })
                audio.play()
            }
            else {
                this.setState(
                    {
                        idx: 0,
                        nowPlaying: this.state.queu[0].id,
                        pause: true
                    })
            }
        }
    }

    pause = () => {
        var audio = document.getElementById("audio");
        audio.pause()
        this.setState({ pause: false })
    }

    next = (args) => {
        if (!this.state.shuffle) {
            if (args.idx < this.state.queu.length - 1) {
                this.setState(
                    {
                        idx: this.state.idx + 1,
                        nowPlaying: this.state.queu[this.state.idx + 1].id
                    })
            } else {
                this.setState(
                    {
                        idx: 0,
                        nowPlaying: this.state.queu[0].id

                    })
            }
        } else {
            let random = Math.floor(Math.random() * this.state.queu.length)
            this.setState(
                {
                    idx: random,
                    nowPlaying: this.state.queu[random].id
                })
        }
    }

    previous = (args) => {
        if (args.idx > 0) {
            this.setState(
                {
                    idx: this.state.idx - 1,
                    nowPlaying: this.state.queu[this.state.idx - 1].id

                })
        } else {
            this.setState(
                {
                    idx: this.state.queu.length - 1,
                    nowPlaying: this.state.queu[this.state.queu.length - 1].id
                })
        }
    }

    shuffle = () => {
        if (!this.state.shuffle) {
            this.setState({ shuffle: true })
        }
        else {
            this.setState({ shuffle: false })
        }
    }

    listen4DB = () => {
        if (this.props.response) {
            this.setState({ waiting4DB: false })
            this.stopListening4DB()
        }
    }

    stopListening4DB = () => {
        clearInterval(this.state.interval1);
        this.buildQueu()
    }

    buildQueu = () => {
        let temp = []
        let idx = -1;
        if (this.props.response) {
            for (let i = 0; i < this.props.response.items.length; i++) {
                if (this.props.response.items[i].id.videoId) {
                    idx++
                    let date = this.props.response.items[i].snippet.publishedAt
                    date = date.split('T')
                    temp.push(
                        {
                            title: this.props.response.items[i].snippet.title,
                            description: this.props.response.items[i].snippet.description,
                            thumbnail: this.props.response.items[i].snippet.thumbnails.default.url,
                            id: this.props.response.items[i].id.videoId,
                            published: date[0],
                            idx: idx
                        })
                }
            }
            this.setState({ queu: temp })
        }
    }

    render() {

        return (
            <div className="Results">
                {this.state.queu && <div className="Controls">
                    <section>
                        <img src={this.state.queu[this.state.idx].thumbnail} alt="oops" height="85" width="115"></img>
                        <h1>
                            {this.state.queu[this.state.idx].title}
                        </h1>
                    </section>
                    <div className="Buttons">
                        <img id="Prev_Btn" src="./res/prev.png" alt="=&lt;&lt;" onClick={() => this.previous(this.state.queu[this.state.idx])}></img>
                        {!this.state.pause &&
                            <img id="Play_Btn" src="./res/play.png" alt="&gt;" onClick={() => this.playTrack()}></img>}
                        {this.state.pause &&
                            <img id="Pause_Btn" src="./res/pause.png" alt="||" onClick={() => this.pause()}></img>}
                        <img id="Next_Btn" src="./res/next.png" alt="&gt;&gt;" onClick={() => this.next(this.state.queu[this.state.idx])}></img>
                        {this.state.progress && this.state.duration && <p>{this.state.progress}/{this.state.duration}</p>}
                        {!this.state.shuffle && <img id="Shuffle_Btn" src="./res/shuffle.png" alt="shuflle" onClick={() => this.shuffle()}></img>}
                        {this.state.shuffle && <img id="No_Shuffle_Btn" src="./res/no-shuffle.png" alt="shuflle" onClick={() => this.shuffle()}></img>}
                    </div>
                    {this.state.pause && <Bars />}
                </div>}
                {this.state.queu && <div className="List">
                    <ul>
                        {this.state.queu.map(videos =>
                            <div className="Item" tabIndex={videos.idx} key={Math.random() * Math.random()} onClick={() => this.playTrack(videos)} >
                                <div className="Image">
                                    <img src={videos.thumbnail} alt="Smiley face" height="90" width="120"></img>
                                </div>
                                <div className="Info">
                                    {/* <li>{videos.title}</li> */}
                                    <li dangerouslySetInnerHTML={{__html: videos.title}}></li>
                                    <p>{videos.published}</p>
                                </div>
                            </div>)}
                    </ul>
                </div>}
                <Decoder
                    videoId={this.state.nowPlaying}
                    next={this.decoderNext}
                    duration={this.decoderDuration}
                    progress={this.decoderProgres}
                />
            </div>
        )
    }

}

export default MediaPlayer