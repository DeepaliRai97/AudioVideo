import React, {Component,useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView ,Image} from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';

const VideoScreen =(props) => {
  let videoPlayer;
  const [currentTime,setCurrentTime] = useState(0);
  const [duration,setDuration] = useState(0);
  const [isFullScreen,setFullScreen] = useState(false);
  const [isLoading,setLoading]=useState(true);
  const [paused,setPaused]=useState(false);
  const [playerState,setPlayerState]=useState(PLAYER_STATES.PLAYING);
  const [screenType,setScreenType]=useState('contain')
  const [videos,setVideos]=useState(require('../assets/video/Video1.mp4'))
  const [videoList,setVideoPlayList]=useState([{   
    name:'Jhak Maar Ke',
    source:require('../assets/video/Video1.mp4'),
    description:'Movie : Desi Boyz , Artists :  Harshdeep Kaur, Neeraj Shridhar',
    imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlCCR5LPK_MOf8HCvQ4gf-Hp3NEfRXGVsJVg&usqp=CAU'
  },
  { name:'Tung Tung Baje',
    source:require('../assets/video/Video2.mp4'),
    description:'Movie : Singh is Bliing , Artists :  Diljit Dosanjh, Jyoti Nooran, Sultana Nooran',
    imageUrl:'https://lh3.googleusercontent.com/IZ78CEsNcxptUv6a-rGc_5M0JWOnoGdNN8Xr7R32lcRalJV0Mo1gayzDZO64Ag0uGfiBDw=s152'
  },
  { name:'Memba',
    source:require('../assets/video/Video3.mp4'),
    description:'Movie : The Sky is Pink , Artists : Nooran Sisters',
    imageUrl:'https://lh3.googleusercontent.com/lcpc_hWcROWbsHsC4JJ9seWT_qcVtB4SNiy6UW6TY3MyA0I_Pclpd2HySog4hFNthpV_dg=s152'
  },
  { name:'Nikle Currant',
    source:require('../assets/video/Video4.mp4'),
    description:'Album Song , Artists :  Jassie Gill, Neha Kakkar',
    imageUrl:'https://lh3.googleusercontent.com/Ctnbg_lhYoQjBEDx13lUu8RhqV1jXxZCSlbV5qtas-w2as8C9dHxo5S94SfB3UDQhDTWFQ=s143'
  },
  { name:'Namo Namo',
    source:require('../assets/video/Video5.mp4'),
    description:'Movie : Kedarnath , Artist : Amit Trivedi',
    imageUrl:'https://lh3.googleusercontent.com/PvphHhh8Wds6uAb0yY7EE8F8yU2XylwncbMfM1zk2Kq6aTyzQVH_Cp6Ij5s6cIfLYjfX8g=s85'
  }
  ])
      
  const changeVideos=(name)=> {
    setVideos( name ); 
  }

 const itemSeparator = () => {  
    return (  
        <View style={styles.itemSeparator} />  
    );  
  }

 const onSeek = seek => {
    videoPlayer.seek(seek);
  };

 const  onPaused = playerState => {
    setPaused(!paused) ,
    setPlayerState(playerState)
    
  };

 const  onReplay = () => {
    setPlayerState( PLAYER_STATES.PLAYING );
    videoPlayer.seek(0);
  };

 const onProgress = data => {
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime( data.currentTime );
    }
  };
  
 const onLoad = data => {setDuration(data.duration),setLoading(false)}
  
 const onLoadStart = data => setLoading( true );
  
 const onEnd = () => setPlayerState(PLAYER_STATES.ENDED );
  
 const onError = () => alert('Oh! ', error);
  
 const onFullScreen = () => {
    if (screenType == 'contain')
      setScreenType( 'cover' );
    else setScreenType('contain' );
  };

const onSeeking = currentTime => setCurrentTime(currentTime );

  
    return (
      <View style={styles.container}>
        <View style={{flex:1}}>
        <Video
          onEnd={onEnd}
          onLoad={onLoad}
        //onBuffer={onBuffer}                
          onError={onError}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          paused={paused}
          ref={videoPlayer => (videoPlayer = videoPlayer)}
          resizeMode={screenType}
          onFullScreen={isFullScreen}
          source={videos} 
          style={styles.mediaPlayer}
          volume={10}
        />
        <MediaControls
          duration={duration}
          isLoading={isLoading}
          mainColor="blue"
          onFullScreen={onFullScreen}
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          playerState={playerState}
          progress={currentTime}
        />
        </View>
        { (screenType=='contain')?
        <View style={{flex:2}}>
        <FlatList
            data={videoList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>  
          <ScrollView>
          <TouchableOpacity
            onPress={() => setVideos(item.source)}
            style={{
            backgroundColor: 'white',
            margin: 10,
            padding: 10,
            borderWidth: 0.5,
            elevation: 5,
          }}>
            <View style={styles.bottomText}>
            <Image source={{uri: item.imageUrl}}
            style={{height: 70, width: 70}}/>
            <Text style={styles.title}>Title:{' '}<Text style={styles.titleText}>{item.name}</Text>
            </Text>
            </View>
            <Text style={styles.description}>
              Description:{' '}
              <Text style={styles.titleText}>
                {item.description}
              </Text>
             </Text>
            </TouchableOpacity>
            </ScrollView>
          }
          ItemSeparatorComponent={itemSeparator}
        />
        </View>
        : null }
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
  },
  itemSeparator:{  
    height: 1,  
    width: "100%",  
    backgroundColor: "#000",  
  },
  btn:{
    backgroundColor:'blue',
    flex:1,
    height:100,
    backgroundColor:'#8080ff',
    alignItems:'center',
    justifyContent:'center',
  },
  btnText:{
    fontSize:22
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
});
export default VideoScreen;