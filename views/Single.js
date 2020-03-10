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
    Form,
    Item,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {fetchGET, fetchPOST, fetchDELETElike} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import FormCommentInput from '../components/FormCommentInput';
import CommentList from "../components/CommentList";
import {KeyboardAvoidingView} from 'react-native';
import {validateField} from "../utils/validation";
import {commentConstraints} from "../constants/validationConst";
import useUploadForm from "../hooks/UploadHooks";
import useCommentForm from "../hooks/CommentHooks";

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
    const [user, setUser] = useState({});
    const media = props.navigation.getParam('file', 'media not found');
    console.log('Single media const: ', media);
    const {navigation} = props;
    const file = navigation.state.params.file;
    const [liked, setLiked] = useState();

    const {
        errors,
        setErrors,
    } = useUploadForm();

    const [likeCount, setLikeCount] = useState();
    const {handleCommentChange, inputs} = useCommentForm();

    const validationProperties = {
        comment: {comment: inputs.comment},
    };

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

            const response = await fetchDELETElike('favourites/file/' + file.file_id, data, token);
            console.log('dislike', response);
            await getLikes();
        } catch (error) {
            console.log(error.message);
        }
    };

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

    const handleComment = text => {
        handleCommentChange(text);
        validate('comment', text)
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

    const handleSendComment = () => {
        sendCommentAsync();
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
                </Card>

                <Form>
                    <Item>
                        <FormCommentInput
                            placeholder="Add comment..."
                            value={inputs.comment}
                            onChangeText={handleComment}
                        />
                    </Item>

                    <Button
                        full
                        onPress={handleSendComment}
                    >
                        <Text >Send</Text>
                    </Button>
                </Form>

                <CommentList file={file.file_id}/>

            </Content>
        </Container>
    );
};

Single.propTypes = {
    navigation: PropTypes.object,
    file: PropTypes.object,
};

export default Single;
