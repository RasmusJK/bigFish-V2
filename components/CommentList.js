/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View,
} from 'native-base';
import {fetchGET} from '../hooks/APIHooks';
import {MediaContext} from '../contexts/MediaContext';
import {CommentContext} from "../contexts/CommentContext";
import CommentItem from "./CommentItem";
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import List from './List';

const CommentList = (props) => {
    console.log('commentList props: ', props);

    const [comment, setComment] = useContext(CommentContext);
    const [loading, setLoading] = useState(true);

    const getComments = async (fileId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('mode', fileId);
            const json = await fetchGET('comments/file', fileId, token);

    /**  json format:
        getComments:  Array []
        commentList props:  Object {
            "file": 601,
        }   */

            console.log('getComments: ', json);
            setComment({
                json
            });
            setLoading(false);
        } catch (e) {
            console.log('getComments error', e);
        }
    };

    useEffect(() => {
        getComments(props);
    }, []);

    return (
        <BaseList
            dataArray={comment}
            renderItem={
                ({comment}) => <CommentItem
                    singleComment={comment}
                    />
            }
        />
    );
};

CommentList.propTypes = {
    navigation: PropTypes.object,
};

export default CommentList;
