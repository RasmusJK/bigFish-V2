import React from 'react';
import {
    ListItem as BaseListItem,
    Body,
    Right,
    Button,
    Text,
} from 'native-base';
import PropTypes from 'prop-types';

const CommentItem = (props) => {

    console.log('commentItem current file_id: ', props.file_id);


    return (
        <BaseListItem thumbnail>
            <Body>
                <Text numberOfLines={1}>{props.user_id}</Text>
                <Text numberOfLines={3}>{props.comment}</Text>
            </Body>
        </BaseListItem>
    );
};

CommentItem.propTypes = {
    singleComment: PropTypes.object,
};

export default CommentItem;
