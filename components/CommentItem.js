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
    return (
        <BaseListItem thumbnail>
            <Body>
                <Text numberOfLines={1}>{props.Object.user_id}</Text>
                <Text numberOfLines={3}>{props.Object.comment}</Text>
            </Body>
            <Right>
                <Button full onPress={
                    () => {
                        console.log('CommentItem.js like pressed');
                    }
                }/>
            </Right>
        </BaseListItem>
    );
};

CommentItem.propTypes = {
    singleComment: PropTypes.object,
};

export default CommentItem;
