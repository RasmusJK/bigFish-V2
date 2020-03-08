/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View, Content, Separator, Text
} from 'native-base';
import {fetchGET} from '../hooks/APIHooks';
import {getComments} from '../hooks/CommentHooks';
import {CommentContext} from "../contexts/CommentContext";
import CommentItem from "./CommentItem";
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';

const CommentList = (props) => {

    const [comment, setComment] = useContext(CommentContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const json = getComments(props);
        setLoading(false);
        setComment({
            allComments: json
        });
    }, []);

    return (
        <Content>
            <Separator bordered>
                <Text>Comments</Text>
            </Separator>
            {loading ? (
                <Spinner/>
            ) : (
                <BaseList
                    dataArray={comment.allComments}
                    renderItem={
                        ({comment}) =>
                            <CommentItem
                                singleComment={comment}/>}
                />
            )}
        </Content>
    );
};

CommentList.propTypes = {
    allComments: PropTypes.array,
};

export default CommentList;
