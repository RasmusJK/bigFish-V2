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
} from 'native-base';
import PropTypes from 'prop-types';
import {Dimensions} from 'react-native';
import {fetchGET} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';

const deviceHeight = Dimensions.get('window').height;

const SingleComment = (props) => {
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
                <Card>
                    <CardItem>
                        <Icon name='image'/>
                        <Body>
                            <H3>{file.title}</H3>
                            <Text>{file.description}</Text>
                            <Text>By {user.username}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
        </Container>
    );
};

SingleComment.propTypes = {
    navigation: PropTypes.object,
};

export default SingleComment;
