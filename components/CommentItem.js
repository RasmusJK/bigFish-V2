import React from 'react';
import {
    ListItem as BaseListItem,
    Body,
    Right,
    Button,
    Text,
} from 'native-base';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';

const Comment = (props) => {
    try{
    console.log('commentItem props: ', props);
    return (
        <BaseListItem>
            <Body>
                <Text numberOfLines={1}>{props.singleComment.comment}</Text>
            </Body>
        </BaseListItem>
    );}catch(e){
        console.log('CommentItem error: ', e);
    }
};

Comment.propTypes = {
    singleComment: PropTypes.object,
    getComments: PropTypes.func,
};

export default Comment;
