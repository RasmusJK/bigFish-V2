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
                <Text numberOfLines={1}>{props.singleMedia.description}</Text>
                <Text numberOfLines={3}>{props.singleMedia.description}</Text>
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
    singleMedia: PropTypes.object,
    navigation: PropTypes.object,
};

export default CommentItem;
