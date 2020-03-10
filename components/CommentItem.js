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


const Comment = (props) => {
    try {

        const [loading, setLoading] = useState(true);
        const [user, setUser] = useState({});

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

        /**
         * Function made for formatting date/time, not working yet.
         *
         const date = (time_added) => {
            const options = {day:'numeric',month:'numeric',year:'2-digit',hour:'numeric',minute:'numeric'};
            console.log('date func: ',time_added.toLocaleDateString("en-US", options));
            //return time_added.toLocaleDateString("en-US", options);
        };

         //console.log(props.singleComment.time_added);
         //date(props.singleComment.time_added);
         */

        return (
            <BaseListItem>
                {loading ? (
                    <Spinner/>
                ) : (
                    <Body>
                        <Content style={{flexDirection: 'row'}}>
                            <Text style={{flex: 2}}>{props.singleComment.time_added}</Text>
                            <Text style={{flex: 1}}>{user.username}</Text>
                        </Content>
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
