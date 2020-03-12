import React, {useState} from 'react';
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
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {fetchDELETE, fetchDELETElike, fetchGET, fetchPOST} from '../hooks/APIHooks';
import {AsyncStorage, TouchableOpacity} from 'react-native';
import getTheme from '../native-base-theme/components';

const ListItem = (props) => {
    let [liked, setLiked] = useState(false);

    const allData = JSON.parse(props.singleMedia.description);
    const description = allData.description;

    const getLikes = async (id) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const resp = await fetchGET('favourites/file', id, token);
            console.log('response getLikes: ', resp);
            return resp.length;
        } catch (e) {
            console.log('ListItem.js getLikes error: ', e);
        }
    };

    const like = async (file) => {
        try {
            const fileId = file.file_id;
            console.log('ListItem like file: ' + file + 'fileId: ' + fileId);
            const token = await AsyncStorage.getItem('userToken');
            const data = {
                file_id: file.file_id,
            };
            const resp = await fetchPOST('favourites', data, token);
            console.log('ListItem like', resp);
            await getLikes(fileId);
        } catch (e) {
            console.log('ListItem like error: ', e);
        }
    };

    const dislike = async (file) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const fileId = file.file_id;
            const data = {
                file_id: file.file_id,
            };
            const resp = await fetchDELETElike('favourites/file/' + fileId, data, token);
            console.log('ListItem dislike response: ', resp);
            await getLikes(fileId);
        } catch (e) {
            console.log('ListItem dislike error: ', e);
        }
    };

    try {
        return (
            <StyleProvider style={getTheme()}>
                <BaseListItem thumbnail noIndent style={{borderBottomWidth: 1}}>
                    <Left>
                        <Thumbnail
                            source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}/>
                    </Left>
                    <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                        <H3 style={{marginLeft: 10, marginTop: 10}}>{props.singleMedia.title}</H3>
                        <Text style={{marginLeft: 10}} note>{description}</Text>

                        <View style={{marginLeft: 10, marginTop: 10, width: '100%', flexDirection: 'row', alignItems:'stretch'}}>
                            <Button small transparent iconRight onPress={
                                () => {
                                    props.navigation.push('Single', {file: props.singleMedia});
                                }
                            }><Text>Show comments</Text>
                                <Icon name='chatbubbles'/>
                            </Button>
                            <Button small transparent iconRight onPress={
                                () => {
                                    like(props.singleMedia.file_id);
                                }
                            }><Text>Like</Text>
                                <Icon name='thumbs-up'/>
                            </Button>
                        </View>
                    </View>
                    <Right>

                        {props.mode === 'myfiles' &&
                        <>
                            <Button
                                full
                                warning
                                onPress={
                                    () => {
                                        props.navigation.push('Modify', {file: props.singleMedia});
                                    }
                                }
                            >
                                <Icon name='create'/>
                            </Button>
                            <Button
                                full
                                danger
                                onPress={async () => {
                                    const token = await AsyncStorage.getItem('userToken');
                                    const del = await fetchDELETE('media', props.singleMedia.file_id,
                                        token);
                                    console.log('delete', del);
                                    if (del.message) {
                                        props.getMedia(props.mode);
                                    }
                                }}
                            >
                                <Icon name='trash'/>
                            </Button>
                        </>
                        }
                    </Right>

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
