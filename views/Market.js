//View for files with fishmarket tag

import React, {useState} from 'react';
import {
    Text,
    View,
    Header,
    Icon,
    Item,
    Input,
    Button,
    Container,
    Right,
    List as BaseList, StyleProvider
} from 'native-base';
import List from '../components/List';
import PropTypes from 'prop-types';
import Home from './Home';
import {searchGet} from '../hooks/SearchHooks';

import ListItem from '../components/ListItem';
import getTheme from "../native-base-theme/components";


const Market = (props) => {
    console.log('Market props', props);
    const {navigation} = props;

    const [searchValue, setSearchValue] = useState('');
    const [search, setSearch] = useState([]);
    const [toggleSearch, setToggleSearch] = useState(false);
    const handleSearchValue = (text) => {
        setSearchValue(text);
    };
    const processSearch = async () => {
        console.log(searchValue);
        const searchGetResult = await searchGet(searchValue, 'fishmarket');
        setSearch(searchGetResult);
        setToggleSearch(true);
    };

    return (

        <StyleProvider style={getTheme()}>
            <Container>
                <Header searchBar rounded>
                    <Item style={{flex: 4}}>

                        <Input placeholder="Search" onChangeText={handleSearchValue} value={searchValue}/>

                    </Item>
                    <Right>
                        <Button rounded icon onPress={processSearch}>
                            <Icon name='search'/>
                        </Button>
                    </Right>
                </Header>

                <View>
                    {toggleSearch !== true &&
                    <List navigation={navigation} mode={'market'}/>
                    }
                </View>
                {toggleSearch !== false &&
                <BaseList
                    dataArray={search}
                    keyExtractor={(item, index) => index.toString()}
                    renderRow={
                        (item) => <ListItem
                            navigation={props.navigation}
                            singleMedia={item}

                        />}
                />}
            </Container>
        </StyleProvider>
    );
};
Home.propTypes = {
    navigation: PropTypes.object,
};
export default Market;