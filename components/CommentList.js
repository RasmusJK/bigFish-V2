/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View,
} from 'native-base';
import ListItem from './ListItem';
import {fetchGET, getAllMedia, getUserMedia} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import {setComments} from "../hooks/UploadHooks";
import {CommentContext} from "../contexts/CommentContext";

const CommentList = (props) => {
    const [comment, setComment] = useContext(CommentContext);
    const [loading, setLoading] = useState(true);

    const getComments = async (post) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const json = await fetchGET('comments', 'file/503', token);
            console.log('getComments: ', json);
            setComment(json);
        } catch (e) {
            console.log('getComments error', e);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    return (
        <View>
            {loading ? (
                <Spinner/>
            ) : (
                <>
                    <BaseList
                        dataArray={comment.allComments}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => <ListItem
                            navigation={props.navigation}
                            singleMedia={item}
                            getComments={getComments}
                        />}
                    />
                    }
                </>
            )}
        </View>
    );
};

CommentList.propTypes = {
    navigation: PropTypes.object,
};

export default CommentList;
