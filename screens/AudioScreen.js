import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View, TouchableOpacity,FlatList,Image} from 'react-native';
import Slider from 'react-native-slider';
import { Player } from '@react-native-community/audio-toolkit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import data from './HomeScreen';

type Props = {};

type State = {
  playPauseButton: string,
  stopButtonDisabled: boolean,
  playButtonDisabled: boolean,
  loopButtonStatus: boolean,
  progress: number,
  error: string | null,
  name:string
};

export default class AudioScreen extends Component<Props, State> {
  player: Player | null;
  lastSeek: number;
  _progressInterval: IntervalID;
  interval:IntervalID;
  constructor(props: Props) {
    super(props);
  this.state = {
      playPauseButton: 'play-circle',
      stopButtonDisabled: true,
      playButtonDisabled: true,
      loopButtonStatus: false,
      progress: 0,
      time:0,
      error: null,
      name:'file1',
      fakename:'file'
    };
  }
  componentWillUpdate(){
    if(this.state.name!=this.state.fakename)
    {
      this._reloadPlayer();
      this.setState({fakename:this.state.name})
    }
  }
  
  componentWillMount() {
   // let interval
    this.player = null;
    this.lastSeek = 0;
    this.state;
    console.log(this.state.name)
    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) {
        let currentProgress = Math.max(0, this.player.currentTime) / this.player.duration;
        if (isNaN(currentProgress)) {
          currentProgress = 0;
        }
        this.setState({ progress: currentProgress });
      }
    }, 1000);
    
  }
 
  componentWillUnmount() {
    clearInterval(this._progressInterval);
    clearInterval(this.interval)
  }

  _shouldUpdateProgressBar() {
   return Date.now() - this.lastSeek > 200;
  }

  _updateState(err) {
    this.setState({
      playPauseButton: this.player && this.player.isPlaying ? 'pause-circle' : 'play-circle',
      stopButtonDisabled: !this.player || !this.player.canStop,
      playButtonDisabled: !this.player || !this.player.canPlay ,
     
    });
  }
  _reloadPlayer(){
    if (this.player) {
      this.player.destroy();
    }
     this.player = new Player(this.state.name, {
      autoDestroy: false
    }).play((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        this.player.looping = this.state.loopButtonStatus;
      }
     this._updateState();
    });
     this._updateState();
     this.player.on('ended', () => {
      this._updateState();
    });
    this.player.on('pause', () => {
      this._updateState();
    });
}
  _playPause() {
    this.player.playPause((err, paused) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }
    this.lastSeek = Date.now();
    let position = percentage * this.player.duration;
    this.player.seek(position, () => {
    this._updateState();
    });
  }
 
  _toggleLooping(value) {
    this.setState({
      loopButtonStatus: value
    });
    if (this.player) {
      this.player.looping = value;
    }
  }
   
  readableTime(duration) {
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
    var ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }
   
  seekBackward = async () => {
    if (!this.player) {
      return;
    }
    this.lastSeek = Date.now();
    let position =
      this.player.currentTime - 5000 < 0 ? 0 : this.player.currentTime - 5000;
    await this.player.seek(position);
  };
   
  seekForward = async () => {
    if (!this.player) {
      return;
    }
    this.lastSeek = Date.now();
    let position =
      this.player.currentTime + 5000 >this.player.duration
        ? this.player.duration
        : this.player.currentTime + 5000;
    await this.player.seek(position);
  };
   
  slow = async () => {
    if (this.player.isPaused || this.player.isStopped || this.player.speed - 0.25 <= 0) return;
    this.player.speed = this.player.speed - 0.25;
  };

   
  fast = async () => {
    if (this.player.isPaused || this.player.isStopped || this.player.speed + 0.25 >= 2) return;
    this.player.speed = this.player.speed + 0.25;
  };

  render() {
    return (
      <SafeAreaView >
         <View style={styles.playback}>
         <View>
         <Text style={styles.titleplay}>Playback</Text>
         </View>
         <View style={styles.settingsContainer}>
          <Switch
            onValueChange={(value) => this._toggleLooping(value)}
            value={this.state.loopButtonStatus} />
          <Text>Toggle Looping</Text>
          </View>
          <View style={styles.slider}>
          <Slider step={0.0001}  
            onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress} />
          </View>
          <View style={styles.timeSlap}>
          <Text style={styles.time}>
           {this.player && this.player.duration != -1
           ? this.readableTime(this.player.duration / 1000)
           : this.readableTime(0)}
          </Text>
          </View>
          <View style={styles.playStop}>
          <TouchableOpacity
            onPress={this.slow}
            hitSlop={{right: 20}}
            style={{marginRight: 20}}>
            <Icon size={25} name="fast-backward"  style={styles.fastbackward}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.seekBackward} hitSlop={{right: 20}}>
            <Icon name="backward"  size={23} />
          </TouchableOpacity>
          <TouchableOpacity  disabled={this.state.playButtonDisabled} onPress={() => this._playPause()} >
            <Icon name={this.state.playPauseButton} style={styles.play}/>
          </TouchableOpacity>
          <TouchableOpacity  disabled={this.state.stopButtonDisabled} onPress={() => this._stop()}>
            <Icon name="stop-circle" style={styles.stop}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.seekForward} hitSlop={{left: 20}}>
            <Icon name="forward"  size={23} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.fast}
            hitSlop={{left: 20}}
            style={{marginLeft: 20}}>
            <Icon size={25} name="fast-forward" style={styles.fastforward}/>
          </TouchableOpacity>
          </View>
          <View>
          <Text style={styles.errorMessage}>{this.state.error}</Text>
          </View>
          </View>
          <View style={styles.flatlist}>
          <FlatList
           data={data}
           keyExtractor={(item, index) => index.toString()}
           renderItem={({item, index}) => (
          <TouchableOpacity
           onPress={() => {this.setState({name:item.fileName})}}
           style={{
            backgroundColor: 'white',
            margin: 10,
            padding: 10,
            borderWidth: 0.5,
            elevation: 5,
          }}>
            <View style={styles.bottomText}>
            <Image source={{uri: item.imageUrl}} style={{height: 70, width: 70}}/>
            <Text style={styles.title}>Title:{' '}<Text style={styles.titleText}>
                {item.title}
            </Text>
            </Text>
          </View>
            <Text style={styles.description}>
              Description:{' '}
              <Text style={styles.titleText}>
                {item.description}
            </Text>
            </Text>
            </TouchableOpacity>
      )}
    />
    </View>
    </SafeAreaView>
    );
        }
}

const styles = StyleSheet.create({
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 10,
    fontSize:10,
    marginTop:5
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  titleplay: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
 },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red'
  },
  play:{
   fontSize:35,
   color:'#008080',
  },
  stop:{
    fontSize:35,
    color:'#800000',
 },
  playStop:{
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:20
  },
  timeSlap:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginLeft:10,
    marginRight:10,
  },
  time:{
    color:'#0000A0',
    marginTop:20,
    justifyContent:'flex-end'
  },
  songTitle:{
    color:"#800080",
    fontWeight:'bold',
    alignItems:'center',
    justifyContent:'center',
    fontSize:20,
    padding:10,
  },
  backward:{
    marginLeft:20
  },
  forward:{
    marginRight:20
  },
  fastbackward:{
    color:'#FFA62F',
   marginLeft:90,
  },
  fastforward:{
    color:'#FFA62F',
   marginRight:90
  },
  title:{
    color:"#800080",
    fontWeight:'bold',
    marginLeft:30,
    marginTop:20,
    alignItems:'center',
    justifyContent:'center',
    fontSize:15,
    marginBottom:20,
    backgroundColor:'#737CA1',
    padding:10
  },
  titleText:{
    color:'black',
    marginLeft:10
  },
  bottomText:{
    flexDirection:'row',
  },
  description:{
    color:"#800080",
    fontWeight:'bold',
  },
  flatlist:{
    height:'60%'
  },
  playback:{
    height:'40%'
  }
});


/*<View style={styles.timeSlap}>
<Text style={styles.time}>{this.state.time}</Text>
<Text style={styles.time}>
 {this.player && this.player.duration != -1
 ? this.readableTime(this.player.duration / 1000)
  : this.readableTime(0)}
  </Text>
  <Text style={styles.time}>
 </View>*/
  /**<Animated.Text>
  {this.player ? this.readableTime(this.player.currentTime / 1000) : this.readableTime(0)}
  </Animated.Text>
  */
         