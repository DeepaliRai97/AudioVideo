import React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,Image} from 'react-native';
 const AudioVideo = ({navigation}) =>{
     return(
         <View>
             <View style={styles.Audio}>
             <TouchableOpacity onPress={()=>{navigation.navigate('Audio')}}>
             <Text style={styles.audioText}>Audio Play List</Text>   
             <Image
             source={{uri: 'https://lh3.googleusercontent.com/zEQcwMrPYw4Mn6hUUK_Mx6Ek0PaNcwrDgzboVzh3Conm7LSN6eI6I_G3rXHmT8AOLwtSkg=s157'}}
             style={styles.image}
             />
             </TouchableOpacity>
             </View>
             <View style={styles.Audio}>
             <TouchableOpacity onPress={()=>{navigation.navigate('Video')}}>
             <Text style={styles.videoText}>Video Play List</Text>
             <Image
             source={{uri: 'https://lh3.googleusercontent.com/WM8TLsFlHuWppyrxRCeIfbcN_1Re_siIVCNMu4IcciceKclRcjwxl_g_hs5s1d4lSm_-=s113'}}
             style={styles.image}
             />
             </TouchableOpacity>
             </View>
             </View>
     )
 }
const styles = StyleSheet.create({
    Audio:{
     alignItems:'center',
     marginBottom:50,
     justifyContent:'center',
     flexDirection:'row',
     marginLeft:80,
     marginTop:50,
     height:200,
     width:200,
    },
    image:{
     height:200,
     width:300,
     marginBottom:50
    },
   videoText:{
     marginBottom:10,
     fontWeight:'bold',
     fontSize:20,
     color:'#7E3517'
   },
   audioText:{
     marginBottom:10,
     fontWeight:'bold',
     fontSize:20,
     color:'#0000A0'
   }
})

  export default AudioVideo;