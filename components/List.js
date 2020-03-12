/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
    List as BaseList, Spinner, View, StyleProvider,
} from 'native-base';
import ListItem from './ListItem';
import CardListItem from './CardListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getAllMedia, getUserMedia, getTaggedMedia} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {AsyncStorage, FlatList} from 'react-native';
import getTheme from '../native-base-theme/components';
import {ThemeProvider} from "react-native-elements";

const List = (props) => {
    const [media, setMedia] = useContext(MediaContext);
    const [loading, setLoading] = useState(true);

    console.log('mediaList props: ', props);

    const getMedia = async (mode) => {
        try {
            console.log('mode', mode);
            const allData = await getAllMedia();
            const token = await AsyncStorage.getItem('userToken');
            const myData = await getUserMedia(token);
            const tagData = await getTaggedMedia('fishforum');
            const tagDataMarket = await getTaggedMedia('fishmarket');
            tagData;
            tagDataMarket;

            setMedia({
                allFiles: allData.reverse(),
                tagFiles: tagData,
                myFiles: myData,
                market: tagDataMarket,
            });
            setLoading(false);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        getMedia(props.mode);
    }, []);

    return (
        <StyleProvider style={getTheme()}>
            <View>
                {loading ? (
                    <Spinner/>
                ) : (
                    <>
                        {props.mode === 'all' &&
                        <BaseList
                            dataArray={media.tagFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => <ListItem
                                navigation={props.navigation}
                                singleMedia={item}
                                mode={props.mode}
                                getMedia={getMedia}
                            />}
                        />
                        }
                        {props.mode === 'market' &&
                        <BaseList
                            dataArray={media.market}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => <ListItem
                                navigation={props.navigation}
                                singleMedia={item}
                                mode={props.mode}
                                getMedia={getMedia}
                            />}
                        />
                        }
                        {props.mode === 'myfiles' &&
                        <BaseList
                            dataArray={media.myFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => <ListItem
                                navigation={props.navigation}
                                singleMedia={item}
                                mode={props.mode}
                                getMedia={getMedia}
                            />}
                        />
                        }
                    </>
                )}
            </View>
        </StyleProvider>
    );
};

List.propTypes = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default List;
