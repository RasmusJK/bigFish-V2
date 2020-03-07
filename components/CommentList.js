/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View,
} from 'native-base';
import {fetchGET} from '../hooks/APIHooks';
import {MediaContext} from '../contexts/MediaContext';
import {CommentContext, CommentProvider} from "../contexts/CommentContext";
import CommentItem from "./CommentItem";
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import List from './List';

const CommentList = (props) => {
    console.log('commentList props: ', props);

    const [comment, setComment] = useContext(CommentContext);
    const [loading, setLoading] = useState(true);



    //console.log('commentcontext comment: ', comment);

    const getComments = async (fileId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            //console.log('mode', fileId);
            const id = fileId.file;
            const json = await fetchGET('comments/file', id, token);

            /*  json format:
        getComments:  Array []
        commentList props:  Object {
            "file": 601,
        }   */
            /*console.log('jsonComment: ', comment);
            console.log('json: ', json);
            console.log('comment.comment: ', comment.comment);*/

            let comments = [];

            //json.forEach(comment => console.log('Comments foreach ', comment.comment));
            const addComment = (data) => {
                console.log('addComment: ', data);
                comments.push(data.comment)
            };

            json.forEach(comment => addComment(comment));

            setComment({
                allComments: comments.reverse()
            });

            console.log('allcomments: ', comments.reverse());
            setLoading(false);
        } catch (e) {
            console.log('getComments error', e);
        }
    };

    useEffect(() => {
        getComments(props);
    }, []);

    return (
        <View>
            <BaseList
                dataArray={comments}
                renderItem={
                    ({comment}) =>
                        <CommentItem
                            navigation={props.navigation}
                            singleComment={comment}/>}
            />
        </View>
    );
};

CommentList.propTypes = {
    navigation: PropTypes.object,
};

export default CommentList;
