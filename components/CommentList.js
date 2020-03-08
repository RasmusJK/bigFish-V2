/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View, Content, Separator, Text
} from 'native-base';
import {fetchGET} from '../hooks/APIHooks';
import {CommentContext} from "../contexts/CommentContext";
import CommentItem from "./CommentItem";
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';

const CommentList = (props) => {

    const [comment, setComment] = useState({});
    const [loading, setLoading] = useState(true);

    const getComments = async (props) => {
        try {
            console.log('getComment props: ', props);

            const token = await AsyncStorage.getItem('userToken');
            const id = props.file;
            const json = await fetchGET('comments/file', id, token);

            /*  json format:
        getComments:  Array []
        commentList props:  Object {
            "file": 601,
        }   */
            /*console.log('jsonComment: ', comment);
            console.log('json: ', json);
            console.log('comment.comment: ', comment.comment);*/

            console.log('getComment returning value: ', json);

            setComment(json);
            setLoading(false);

        }catch(e){
            console.log('getComments error: ', e);
        }
    };

    useEffect(() => {
        getComments(props);
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
                    dataArray={comment}
                    renderItem={({item}) => <CommentItem
                                singleComment={item}/>}
                />
            )}
        </Content>
    );
};

CommentList.propTypes = {
    allComments: PropTypes.array,
};

export default CommentList;
