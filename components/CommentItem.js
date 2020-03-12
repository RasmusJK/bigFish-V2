import React, {useEffect, useState} from 'react';
import {
    ListItem as BaseListItem,
    Body,
    Right,
    Left,
    Button,
    Text,
    Spinner,
    Content,
} from 'native-base';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import {fetchGET} from "../hooks/APIHooks";
import Moment from 'react-moment';
import { format } from "date-fns";


const Comment = (props) => {

    try {
        const [loading, setLoading] = useState(true);
        const [user, setUser] = useState({});

        const date = props.singleComment.time_added;
        const dates = date.split('T')[0];
        const hours = date.split('T')[1].substring(0,8);
        //console.log('Date: ', date.substring(0, 10));
        //console.log('Date: ', date.split('T')[0]);
        //console.log('Hours: ', date.split('T')[1].substring(0,8));

        const getUser = async (userId) => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const json = await fetchGET('users', userId, token);

                setUser(json);
                setLoading(false);
            } catch (e) {
                console.log('getUserInfo error: ', e);
            }
        };

        useEffect(() => {
            getUser(props.singleComment.user_id);
        });

        return (
            <BaseListItem>
                {loading ? (
                    <Spinner/>
                ) : (
                    <Body>
                        <Text note>{hours + ' @ ' + dates}</Text>
                        <Text note>{user.username}</Text>
                        <Text numberOfLines={3}>{props.singleComment.comment}</Text>
                    </Body>

                )}
            </BaseListItem>
        );
    } catch (e) {
        console.log('CommentItem error: ', e);
    }
};

Comment.propTypes = {
    singleComment: PropTypes.object,
    getComments: PropTypes.func,
};

export default Comment;
