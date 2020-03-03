import React, {useState, useEffect} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  Icon,
  Text,
  Button,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {fetchGET, fetchPOST, fetchDELETE} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import {setComments} from '../hooks/UploadHooks';
import List from "../components/List";
import CommentList from "../components/CommentList";
import {getPlatformOrientationLockAsync} from 'expo/build/ScreenOrientation/ScreenOrientation';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const [user, setUser] = useState({});
  const {navigation} = props;
  const file = navigation.state.params.file;
  const [liked, setLiked] = useState();
  const [likeCount, setLikeCount] = useState();


  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

  const like = async () => {
    try {
      const data = {
        file_id: file.file_id,
      };
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetchPOST('favourites', data, token);
      console.log('Like', response);
      await getLikes();
    } catch (error) {
      console.log(error.message);
    }
  };

  const dislike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = {
        id: file.file_id,
      };

      const response = await fetchDELETE('favourites/file/' + file.file_id, data, token);
      console.log('dislike', response);
      await getLikes();
    } catch(error){
      console.log(error.message);
    }
  };

  const getLikes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetchGET('favourites/file', file.file_id, token);
      const currentUser = await fetchGET('users/user', '', token);
      if (response.length === 0){
        setLiked(false);
      }
      for (let i = 0; i < response.length; i++){
        if(currentUser.user_id === response[i].user_id) {
          console.log('Getlike true');
          setLiked(true);
        } else {
          console.log('getlike false');
          setLiked(false);
        }
      }
      setLikeCount(response.length);
    }catch(error){
      console.log(error.message);
    }
  };


  useEffect(() => {
    getUser();
    getLikes();
  }, []);

  return (
    <Container>
      <Content>
        <Card>
          <CardItem cardBody>
            {file.media_type === 'image' ? (
                <AsyncImage
                  style={{
                    width: '100%',
                    height: deviceHeight / 2,
                  }}
                  spinnerColor='#777'
                  source={{uri: mediaURL + file.filename}}
                />) :
              (<Video
                source={{uri: mediaURL + file.filename}}
                resizeMode={'cover'}
                useNativeControls
                style={{
                  width: '100%',
                  height: deviceHeight / 2,
                }}
                onError={(e) => {
                  console.log('video error', e);
                }}
                onLoad={(evt) => {
                  console.log('onload', evt);
                }}
              />
              )
            }
          </CardItem>
          <CardItem>
            {!liked ? <Button success onPress={like}>
              <Text>Like</Text>
            </Button> : 
            <Button danger onPress={dislike}>
              <Text>Dislike</Text>
            </Button>}
            <Left>
              {likeCount ? <Text>Likes: {likeCount}</Text> : <Text>Likes: 0</Text>}
            </Left>
          </CardItem>

          <CardItem>
            <Left>
              <Icon name='image'/>
              <Body>
                <H3>{file.title}</H3>
                <Text>{file.description}</Text>
                <Text>By {user.username}</Text>
              </Body>
            </Left>
          </CardItem>

          <CommentList navigation={navigation}/>

        </Card>
      </Content>
    </Container>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
