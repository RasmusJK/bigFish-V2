import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const Home = (props) => {
  // console.log('Home', props);
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'all'}></List>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
