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
  View,
  Right,
  Button,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {fetchGET} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const [toggleCardItem, setToggleCardItem] = useState(true);
  const [user, setUser] = useState({});
  const {navigation} = props;
  const file = navigation.state.params.file;

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  return (
    <Container>
      <Content>
        {toggleCardItem &&
          <Card>
            <CardItem>
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
              <Left>
                <Icon name='image' />
                <Body>
                  <H3>{file.title}</H3>
                  <Text>{file.description}</Text>
                  <Text>By {user.username}</Text>
                </Body>
              </Left>
              <Right>
                <Button full onPress={() => {
                  setToggleCardItem(false);
                }}>
                  <Text>Map</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        }
        {!toggleCardItem &&
        <Card>
          <CardItem>
            <View>
              <MapView
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height /2,
                }}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.04,
                }}>
                <Marker></Marker>
              </MapView>
            </View>
          </CardItem>
          <CardItem>
            <Left>
              <Icon name='image' />
              <Body>
                <H3>{file.title}</H3>
                <Text>{file.description}</Text>
                <Text>By {user.username}</Text>
              </Body>
            </Left>
            <Right>
              <Button full onPress={() => {
                setToggleCardItem(true);
              }}>
                <Text>Picture</Text>
              </Button>
            </Right>
          </CardItem>
          </Card>
          }
      </Content>
    </Container >
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
