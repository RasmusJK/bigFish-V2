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

const Comment = (props) => {
    const [user, setUser] = useState({});
    const {navigation} = props;
    const file = navigation.state.params.file;
    const comments = [];

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
                        <Text></Text>
                    </CardItem>
                </Card>
            </Content>
        </Container>
    );
};

Comment.propTypes = {
    navigation: PropTypes.object,
};

export default Comment;
