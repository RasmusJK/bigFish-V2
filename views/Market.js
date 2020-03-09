import React from 'react';
import {Text,View} from 'native-base';
import List from '../components/List';
import PropTypes from 'prop-types';
import Home from './Home';

const Market = (props) => {
  console.log('Market props',props);
  const {navigation} = props;

  return (
      <View>
        <List navigation={navigation} mode={'market'}></List>
      </View>);
};
Home.propTypes = {
  navigation: PropTypes.object,
};
export default Market;