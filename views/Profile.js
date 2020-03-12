import React, {useEffect, useState} from 'react';
import {
    Container,
    Content,
    Card,
    CardItem,
    Text,
    Body,
    Button,
    Icon,
    H1, H2, H3,
    Left,
    StyleProvider,
    Thumbnail,
    Item,
    View,
} from 'native-base';
import {AsyncStorage} from 'react-native';
import getTheme from '../native-base-theme/components';
import PropTypes from 'prop-types';
import {fetchGET} from '../hooks/APIHooks';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {button, icon, text, colors} from '../constants/stylingConstants';
import List from "../components/List";

const deviceHeight = Dimensions.get('window').height;


const Profile = (props) => {
    const {navigation} = props;
    const [card, setCard] = useState(true);
    const [user, setUser] = useState({
        userdata: {},
        avatar: 'https://',
    });
//Function to get user information and avatar
    const userToState = async () => {
        try {
            const userFromStorage = await AsyncStorage.getItem('user');
            const uData = JSON.parse(userFromStorage);
            const avatarPic = await fetchGET('tags', 'avatar_' + uData.user_id);
            console.log('avpic', avatarPic);
            let avPic = '';
            if (avatarPic.length === 0) { // if avatar is not set
                avPic = 'https://placekitten.com/1024/1024';
            } else {
                avPic = mediaURL + avatarPic[0].filename;
            }
            setUser((user) => (
                {
                    userdata: uData,
                    avatar: avPic,
                }));
        } catch (e) {
            console.log('Profile error: ', e.message);
        }
    };

    useEffect(() => {
        userToState();
    }, []);
//Sign out function
    const signOutAsync = async () => {
        await AsyncStorage.clear();
        props.navigation.navigate('Auth');
    };

    console.log('ava', mediaURL + user.avatar);
    return (
        <StyleProvider style={getTheme()}>
            <Container>
                <Content>
                    <Card>
                        <CardItem header bordered>
                            <Icon name='person'/>
                            <H1>  {user.userdata.username}</H1>
                        </CardItem>

                        <CardItem>
                            <Item style={{flexDirection: 'row'}}>
                                <AsyncImage
                                    style={{
                                        width: '50%',
                                        height: deviceHeight / 4,
                                        borderRadius: '100%',
                                        flex: 1,
                                    }}
                                    spinnerColor='#777'
                                    source={{uri: user.avatar}}
                                />
                                <Body style={{flex: 1.5}}>
                                    <H3>{user.userdata.full_name}</H3>
                                    <Text note>{user.userdata.email}</Text>
                                </Body>
                            </Item>
                        </CardItem>
                        <CardItem footer style={{flexDirection: 'row'}}>
                            <Button style={{margin: button.margin, flex: 1}} full onPress={() => {
                                props.navigation.push('MyFiles');
                            }}>
                                <Text>My Files</Text>
                            </Button>
                            <Button style={{margin: button.margin, flex: 1}} full danger onPress={signOutAsync}>
                                <Text>Logout</Text>
                            </Button>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        </StyleProvider>
    );
};

Profile.propTypes = {
    navigation: PropTypes.object,
};

export default Profile;
