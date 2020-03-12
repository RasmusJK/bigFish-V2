//View for files with fishmarket tag

import React,{useState} from 'react';
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
  List as BaseList
} from 'native-base';
import List from '../components/List';
import PropTypes from 'prop-types';
import Home from './Home';
import {searchGet} from '../hooks/SearchHooks';

import ListItem from '../components/ListItem';


const Market = (props) => {
  console.log('Market props',props);
  const {navigation} = props;

  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState([]);
  const [toggleSearch, setToggleSearch] = useState(false);
  const handleSearchValue = (text) => {
    setSearchValue(text);
  };
  const processSearch = async () => {
    console.log(searchValue);
    const searchGetResult = await searchGet(searchValue,'fishmarket');
    setSearch(searchGetResult);
    setToggleSearch(true);
  };

  return (

      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" onChangeText={handleSearchValue} value={searchValue} />

          </Item>
          <Right>
          <Button transparent onPress={processSearch}>
            <Text>Search</Text>
          </Button>
          </Right>
        </Header>

      <View>
        {toggleSearch !== true &&
        < List navigation={navigation} mode={'market'}/>
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
  );
};
Home.propTypes = {
  navigation: PropTypes.object,
};
export default Market;