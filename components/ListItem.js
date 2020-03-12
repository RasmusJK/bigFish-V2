import React, {useState} from 'react';
import {
    ListItem as BaseListItem,
    Left,
    Body,
    Right,
    Button,
    Text,
    Thumbnail,
    H3,
    Icon,
    Card,
    CardItem,
    Image,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {fetchDELETE, fetchGET} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';


const ListItem = (props) => {
    const allData = JSON.parse(props.singleMedia.description);
    console.log('props: ', props);
    const description = allData.description;
    try {
        return (
            <BaseListItem thumbnail>
                <Left>
                    <Thumbnail
                        square
                        source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
                    />
                </Left>
                <Body>
                    <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
                    <Text numberOfLines={4}>{description}</Text>
                </Body>
                <Right>
                    <Button full onPress={
                        () => {
                            props.navigation.push('Single', {file: props.singleMedia});
                        }
                    }>
                        <Icon name='eye'/>
                    </Button>

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
