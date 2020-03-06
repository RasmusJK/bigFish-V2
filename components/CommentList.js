/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    ListItem as BaseListItem,
    Body, Button, Right,
    Spinner, Text, View,
} from 'native-base';
import ListItem from './ListItem';
import {fetchGET} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {FlatList, AsyncStorage} from 'react-native';
import {setComments} from "../hooks/CommentHooks";
import {CommentContext} from "../contexts/CommentContext";
import CommentItem from "./CommentItem";

const CommentList = (props) => {
    const [comment, setComment] = useContext(CommentContext);
    const [loading, setLoading] = useState(true);

    //const [COMMENTS] = getComments;
    const COMMENTS = [
        {
            user_id: '601',
            text: 'Wow comment 1'
        },
        {
            user_id: '566',
            text: 'aylmao'
        },
        {
            user_id: '155',
            text: 'Woowowow'
        },
        {
            user_id: '602',
            text: 'ASDkjhsd'
        },
    ];

    const testItem = ({user_id, text}) => {
        return (
            <BaseListItem thumbnail>
                <Body>
                    <Text numberOfLines={1}>{user_id}</Text>
                    <Text numberOfLines={3}>{text}</Text>
                </Body>
                <Right>
                    <Button full onPress={
                        () => {
                            console.log('CommentItem.js like pressed');
                        }
                    }/>
                </Right>
            </BaseListItem>
        )
    };

    const getComments = async (mode) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('mode', mode);
            const json = await fetchGET('comments/file', mode.file_id, token);
            console.log('getComments: ', json);
            return json;
        } catch (e) {
            console.log('getComments error', e);
        }
    };

    useEffect(() => {
        getComments(props.navigation.state.params.file);
    }, []);

    return (
        <View>
            <FlatList
                data={COMMENTS}
                renderItem={({testItem})=> <CommentItem user_id={testItem.user_id}
                                                        text={testItem.text}/>}
                keyExtractor={testItem => testItem.id}
            />
        </View>
    );
};

CommentList.propTypes = {
    navigation: PropTypes.object,
};

export default CommentList;
