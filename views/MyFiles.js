import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
//Function to get MyFiles listItem
const MyFiles = (props) => {
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'myfiles'}></List>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
