import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AudioVideo from '../screens/AudioVideo';
import AudioScreen from '../screens/AudioScreen';
import VideoScreen from '../screens/VideoScreen';

const navigator = createStackNavigator({
    MediaPlayer:
    {
        screen:AudioVideo,
    },
   Audio:
    {
        screen:AudioScreen,
    },
    Video:
    {
          screen:VideoScreen,
    }
    },
{
    initialRouteName:'MediaPlayer',
}
);
export default createAppContainer(navigator);
