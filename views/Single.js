import React, {useState, useEffect} from 'react';
import {
    Container,
    Content,
    Card,
    CardItem,
    Left,
    Body,
    H1,
    H3,
    Icon,
    Text,
    View,
    Right,
    Button,
    Form,
    Item,
    StyleProvider,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {fetchGET, fetchPOST, fetchDELETElike} from '../hooks/APIHooks';
import {AsyncStorage, KeyboardAvoidingView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import useUploadForm from '../hooks/UploadHooks';
import CommentList from "../components/CommentList";
import useCommentForm from "../hooks/CommentHooks";
import {validateField} from "../utils/validation";
import {commentConstraints} from "../constants/validationConst";
import FormCommentInput from "../components/FormCommentInput";
import getTheme from '../native-base-theme/components';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
    const [toggleCardItem, setToggleCardItem] = useState(true);
    const [user, setUser] = useState({});
    const {navigation} = props;
    const file = navigation.state.params.file;
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const allData = JSON.parse(file.description);
    const description = allData.description;
    let longitude;
    let latitude;
    let teksti;
//if statement to check if the picture has the location data if there is none it sets one to keep the app not from crashing
    if (allData.longitude === undefined) {
        latitude = 61.249999;
        longitude = 28.249999;
        teksti = 'No location in the picture';
    } else {
        longitude = allData.longitude;
        latitude = allData.latitude;
    }
    console.log(latitude, longitude);

    const media = props.navigation.getParam('file', 'media not found');
    console.log('Single media const: ', media);

    const {
        errors,
        setErrors,
    } = useUploadForm();

    const {handleCommentChange, inputs} = useCommentForm();

    const validationProperties = {
        comment: {comment: inputs.comment},
    };
    //Validation function
    const validate = (field, value) => {
        console.log('vp', validationProperties[field]);
        setErrors((errors) =>
            ({
                ...errors,
                [field]: validateField({[field]: value},
                    commentConstraints),
                fetch: undefined,
            }));
    };
    //Get user function to get user information
    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const json = await fetchGET('users', file.user_id, token);
            console.log('getUser json ',json);
            setUser(json);
        } catch (e) {
            console.log('getUser error', e);
        }
    };

    //Getting like count function
    const getLikes = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetchGET('favourites/file', file.file_id, token);
            const currentUser = await fetchGET('users/user', '', token);
            if (response.length === 0) {
                setLiked(false);
            }
            for (let i = 0; i < response.length; i++) {
                if (currentUser.user_id === response[i].user_id) {
                    console.log('Getlike true');
                    setLiked(true);
                } else {
                    console.log('getlike false');
                    setLiked(false);
                }
            }
            setLikeCount(response.length);
        } catch (error) {
            console.log(error.message);
        }
    };

    //New like function
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

    //Dislike function
    const dislike = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const data = {
                id: file.file_id,
            };

            const response = await fetchDELETElike('favourites/file/' + file.file_id, data, token);
            console.log('dislike', response);
            await getLikes();
        } catch (error) {
            console.log(error.message);
        }
    };

    const sendCommentAsync = async () => {
        try {
            const fileId = media.file_id;
            const token = await AsyncStorage.getItem("userToken");
            const comment = {
                file_id: fileId,
                comment: inputs.comment
            };
            const result = await fetchPOST("comments", comment, token);
            console.log("sendComment result: ", result);
            props.navigation.push("Single", {
                file: media
            });
        } catch (e) {
            console.log("commenting error: ", e.message);
        }
    };

    const handleComment = text => {
        handleCommentChange(text);
        validate('comment', text)
    };

    const handleSendComment = () => {
        sendCommentAsync();
    };

    useEffect(() => {
        getUser();
        getLikes();
    }, []);

    return (
        <StyleProvider style={getTheme()}>
            <Container>
                <Content>
                    {toggleCardItem &&
                    <Card>
                        <CardItem>
                            <H1>{file.title}</H1>
                            <Text note>  @{user.username}</Text>
                        </CardItem>
                        <CardItem style={{paddingRight: 0, paddingLeft: 0, paddingBottom: 0, paddingTop: 0}}>
                            {file.media_type === 'image' ? (
                                    <AsyncImage
                                        style={{
                                            width: '100%',
                                            height: deviceHeight / 3,
                                            margin: 0,
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
                                            height: deviceHeight / 3,
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
                            {!liked ? <Button iconLeft transparent onPress={like}>
                                    <Icon name='thumbs-up'/>
                                    <Text>Like</Text>
                                </Button> :
                                <Button iconLeft transparent onPress={dislike}>
                                    <Icon name='thumbs-down'/>
                                    <Text>Dislike</Text>
                                </Button>}
                            <Left>
                                {likeCount ? <H3>{likeCount}</H3> : <H3>0</H3>}
                            </Left>
                            <Right>
                                <Button iconLeft full onPress={() => {
                                    setToggleCardItem(false);
                                }}>
                                    <Icon name='map'/>
                                    <Text>Map</Text>
                                </Button>
                            </Right>
                        </CardItem>

                        <CardItem>
                            <Left>
                                <Text>{description}</Text>
                            </Left>
                        </CardItem>
                    </Card>
                    }

                    {!toggleCardItem &&
                    <Card>
                        <CardItem>
                            <H1>{file.title}</H1>
                            <Text note>  @{user.username}</Text>
                        </CardItem>
                        <CardItem>
                            <View>
                                <MapView
                                    style={{
                                        width: Dimensions.get('window').width / 1.1,
                                        height: Dimensions.get('window').height / 2,
                                    }}
                                    initialRegion={{
                                        latitude: latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.09,
                                        longitudeDelta: 0.04,
                                    }}>
                                    <Marker
                                        coordinate={{
                                            latitude: latitude,
                                            longitude: longitude,
                                        }}
                                        title={teksti}

                                    />
                                </MapView>
                            </View>
                        </CardItem>

                        <CardItem>
                            {!liked ? <Button iconLeft transparent onPress={like}>
                                    <Icon name='thumbs-up'/>
                                    <Text>Like</Text>
                                </Button> :
                                <Button iconLeft transparent onPress={dislike}>
                                    <Icon name='thumbs-down'/>
                                    <Text>Dislike</Text>
                                </Button>}
                            <Left>
                                {likeCount ? <H3>{likeCount}</H3> : <H3>0</H3>}
                            </Left>
                            <Right>
                                <Button iconLeft full onPress={() => {
                                    setToggleCardItem(true);
                                }}>
                                    <Icon name='image'/>
                                    <Text>Media</Text>
                                </Button>
                            </Right>
                        </CardItem>

                        <CardItem>
                            <Left>
                                <Text>{description}</Text>
                            </Left>
                        </CardItem>
                    </Card>
                    }

                    {toggleCardItem &&
                    <Card>
                        <KeyboardAvoidingView behavior="position">
                            <Form style={{flexDirection: 'row'}}>
                                <CardItem style={{flex: 3}}>
                                    <FormCommentInput
                                        placeholder="Add comment..."
                                        value={inputs.comment}
                                        onChangeText={handleComment}
                                    />
                                </CardItem>
                                <Right>
                                    <Button style={{flex: 1}}
                                            onPress={handleSendComment}
                                    >
                                        <Text>Send</Text>
                                    </Button>
                                </Right>
                            </Form>
                        </KeyboardAvoidingView>
                        <CommentList file={file.file_id}/>
                    </Card>}

                </Content>
            </Container>
        </StyleProvider>
    );
};

Single.propTypes = {
    navigation: PropTypes.object,
    file: PropTypes.object,
};

export default Single;
