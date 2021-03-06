import React, {useState, useEffect, useContext} from 'react';
import {
    Content,
    Form,
    Button,
    Text,
    Item,
    Spinner,
    Radio,
    Left,
    Right,
    ListItem,
    View,
    Icon,
    Card,
    StyleProvider,
} from 'native-base';

import {
    Dimensions,
    Image,
} from 'react-native';
import getTheme from '../native-base-theme/components';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';
import {button, icon, text, colors} from '../constants/stylingConstants';

const deviceHeight = Dimensions.get('window').height;

const Upload = (props) => {
    const [media, setMedia] = useContext(MediaContext);
    const [image, setImage] = useState(null);
    const [send, setSend] = useState(false);
    let longitude;
    let latitude;

    const {
        handleTitleChange,
        handleDescriptionChange,
        handleUpload,
        inputs,
        errors,
        setErrors,
        setInputs,
        loading,
    } = useUploadForm();

    const validationProperties = {
        title: {title: inputs.title},
        description: {description: inputs.description},
    };

    const validate = (field, value) => {
        console.log('vp', validationProperties[field]);
        setErrors((errors) =>
            ({
                ...errors,
                [field]: validateField({[field]: value},
                    uploadConstraints),
                fetch: undefined,
            }));
    };

    const reset = () => {
        setErrors({});
        setInputs({});
        setImage(null);
    };

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    useEffect(() => {
        getPermissionAsync();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            exif: true,
        });

        console.log('pickImage result: ', result);
        console.log(result.exif.GPSLatitude);
        latitude = result.exif.GPSLatitude;
        longitude = result.exif.GPSLongitude;
        console.log('kuvan desc', latitude, longitude);

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const handleTitle = (text) => {
        handleTitleChange(text);
        validate('title', text);
    };

    const handleDescription = (text) => {
        handleDescriptionChange(text);
        validate('description', text);
    };

    const upload = () => {
        console.log('uploadForum reg field errors', errors);
        handleUpload(image, props.navigation, setMedia, 'fishforum');
        reset();
    };

    const uploadMarket = () => {
        console.log('uploadMarket reg field errors', errors);
        handleUpload(image, props.navigation, setMedia, 'fishmarket');
        reset();
    };

    const checkErrors = () => {
        console.log('errors', errors);
        if (errors.title !== undefined ||
            errors.description !== undefined) {
            setSend(false);
        } else {
            setSend(true);
        }
    };

    useEffect(() => {
        checkErrors();
    }, [errors]);

    console.log('send', send);

    return (
        <StyleProvider style={getTheme()}>
            <Content>
                {loading ? (
                    <Spinner/>
                ) : (
                    <Form style={{backgroundColor: colors.colorPrimary}}>
                        <Item>
                            <FormTextInput
                                placeholder='Title'
                                onChangeText={handleTitle}
                                value={inputs.title}
                                error={errors.title}
                            />
                        </Item>
                        <Item>
                            <FormTextInput
                                placeholder='Description'
                                onChangeText={handleDescription}
                                value={inputs.description}
                                error={errors.description}
                            />
                        </Item>
                        {image &&
                        <Card>
                            <Image source={{uri: image.uri}}
                                   style={{width: '100%', height: deviceHeight / 3}}/>
                        </Card>
                        }
                        <Button full
                                style={{margin: button.margin}}
                                onPress={pickImage}>
                            <Text>Select file</Text>
                        </Button>

                        {image && send &&
                        <View style={{flexDirection: 'row'}}>
                            <Button iconLeft

                                    style={{
                                        flex: 1,
                                        margin: button.margin,
                                    }}
                                    onPress={upload}>
                                <Icon color={icon.colorPrimary} name='home'/>
                                <Text>Upload to forum</Text>
                            </Button>
                            <Button iconLeft style={{
                                flex: 1,
                                margin: button.margin,
                            }}
                                    onPress={uploadMarket}>
                                <Icon color={icon.colorPrimary} name='cash'/>
                                <Text>Upload to market</Text>
                            </Button>
                        </View>
                        }
                        <Button
                            dark
                            full
                            onPress={reset}
                            style={{margin: button.margin}}>
                            <Text>Reset form</Text>
                        </Button>
                    </Form>
                )}
            </Content>
        </StyleProvider>
    );
};

// proptypes here
Upload.propTypes = {
    navigation: PropTypes.object,
};

export default Upload;
