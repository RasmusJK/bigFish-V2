import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {View} from 'native-base';
//Function to get MyFiles listItem
const MyFiles = (props) => {
    const {navigation} = props;
    return (
        <View>
            <List navigation={navigation} mode={'myfiles'}/>
        </View>
    );
};

MyFiles.propTypes = {
    navigation: PropTypes.object,
};

export default MyFiles;
