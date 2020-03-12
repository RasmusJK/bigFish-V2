import React, {useState, useEffect} from 'react';
import {
    ListItem as BaseListItem,
    Left,
    Body,
    Right,
    Button,
    Text,
    Thumbnail,
    H1, H2, H3,
    Icon,
    Card,
    CardItem,
    Image,
    StyleProvider,
    View,
    Spinner,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {fetchDELETE, fetchDELETElike, fetchGET, fetchPOST} from '../hooks/APIHooks';
import {AsyncStorage, TouchableOpacity} from 'react-native';
import getTheme from '../native-base-theme/components';

const ListItem = (props) => {
    const allData = JSON.parse(props.singleMedia.description);
    const description = allData.description;
    const [user, setUser] = useState({});

    //Get user function to get user information
    const getUser = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const json = await fetchGET('users', userId, token);
            setUser(json);
        } catch (e) {
            console.log('getUser error', e);
        }
    };

    useEffect(() => {
        getUser(props.singleMedia.user_id);
    }, []);

    try {
        return (
            <StyleProvider style={getTheme()}>
                <BaseListItem thumbnail noIndent style={{borderBottomWidth: 1}}>
                    <Left>
                        <Thumbnail
                            source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}/>
                    </Left>
                    <View style={{flexDirection: 'column', alignItems: 'stretch', width: '85%'}}>
                        <H3 style={{marginLeft: 10, marginTop: 10}}>{props.singleMedia.title}</H3>
                        <Text style={{marginLeft: 10}}>{description}</Text>

                        {props.mode === 'all' &&
                        <View style={{
                            marginLeft: 10,
                            marginTop: 10,
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}>
                            <Text note style={{flex: 1}}>By {user.username}</Text>
                            <Button small style={{flex: 1}} transparent iconRight onPress={
                                () => {
                                    props.navigation.push('Single', {file: props.singleMedia});
                                }
                            }><Text>Show comments</Text>
                                <Icon name='chatbubbles'/>
                            </Button>
                        </View>}

                        {props.mode === 'market' &&
                        <View style={{
                            marginLeft: 10,
                            marginTop: 10,
                            width: '80%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}>
                            <Text note style={{flex: 1}}>By {user.username}</Text>
                            <Button small style={{flex: 1}} transparent iconRight onPress={
                                () => {
                                    props.navigation.push('Single', {file: props.singleMedia});
                                }
                            }><Text>Show comments</Text>
                                <Icon name='chatbubbles'/>
                            </Button>
                        </View>}
                        <Right>

                            {props.mode === 'myfiles' &&
                            <View style={{
                                marginLeft: 10,
                                marginTop: 10,
                                width: '80%',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }}>
                                <Text note style={{flex: 1}}>By {user.username}</Text>
                                <Button warning onPress={
                                    () => {
                                        props.navigation.push('Modify', {file: props.singleMedia});
                                    }
                                }
                                ><Icon name='create'/>
                                </Button>

                                <Button danger onPress={async () => {
                                    const token = await AsyncStorage.getItem('userToken');
                                    const del = await fetchDELETE('media', props.singleMedia.file_id,
                                        token);
                                    console.log('delete', del);
                                    if (del.message) {
                                        props.getMedia(props.mode);
                                    }
                                }}><Icon name='trash'/>

                                </Button>
                            </View>}
                        </Right>
                    </View>
                </BaseListItem>
            </StyleProvider>
        );
    } catch (e) {
        console.log('ListItem get error', e);
        return (
            <BaseListItem/>
        );
    }
};


ListItem.propTypes = {
    singleMedia: PropTypes.object,
    navigation: PropTypes.object,
    mode: PropTypes.string,
    getMedia: PropTypes.func,
};

export default ListItem;
