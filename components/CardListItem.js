import PropTypes from "prop-types";
import React, {useState} from "react";
import {AsyncStorage} from "react-native";
import {fetchGET} from "../hooks/APIHooks";
import {ListItem as BaseListItem,
    Body,
    Button,
    Card,
    CardItem,
    H3,
    Icon,
    Image,
    Left,
    Right,
    Content,
    ListItem,
    Text} from "native-base";
import {mediaURL} from "../constants/urlConst";

const CardListItem = (props) => {
    let [liked, setLiked] = useState(false);

    const allData = JSON.parse(props.singleMedia.description);
    const description = allData.description;

    const getLikes = async (id) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const resp = await fetchGET('favourites/file', id, token);
            console.log('response getLikes: ', resp);
            return resp.length;
        }catch(e){
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
        }catch(e){
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
        }catch (e) {
            console.log('ListItem dislike error: ', e);
        }
    };


    try {
        return (
            <ListItem>
            <Card>
                <CardItem>
                    <Left>
                        <Body>
                            <H3>{props.singleMedia.title}</H3>
                            <Text numberOfLines={4}>{description}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{uri: mediaURL + props.singleMedia.thumbnails.w640}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Left>
                        {!liked ? <Button transparent onPress={like(props.singleMedia)}>
                                <Icon active name="thumbs-up"/>
                                <Text>{getLikes(props.singleMedia.file_id)} likes</Text>
                            </Button> :
                            <Button transparent onPress={dislike(props.singleMedia)}>
                                <Icon active name="thumbs-down"/>
                                <Text>{getLikes(props.singleMedia.file_id)} likes</Text>
                            </Button>}

                    </Left>
                    <Body>
                        <Button transparent onPress={
                            () => {
                                props.navigation.push('Single', {file: props.singleMedia});
                            }
                        }>
                            <Icon active name="chatbubbles"/>
                            <Text>Comments</Text>
                        </Button>
                    </Body>
                    <Right>
                        <Text>{props.singleMedia.time_added}</Text>
                    </Right>
                </CardItem>
            </Card>
                </ListItem>);
    } catch (e) {
        console.log('ListItem get error', e);
        return (
            <BaseListItem/>
        );
    }
};

CardListItem.propTypes = {
    singleMedia: PropTypes.object,
    navigation: PropTypes.object,
    mode: PropTypes.string,
    getMedia: PropTypes.func,
};

export default CardListItem;
