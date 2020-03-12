import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {View} from 'native-base';

const Home = (props) => {
    // console.log('Home', props);
    const {navigation} = props;
    return (
        <View>
            <List navigation={navigation} mode={'all'}/>
        </View>
    );
};

Home.propTypes = {
    navigation: PropTypes.object,
};

export default Home;
