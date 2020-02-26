/* eslint-disable react/display-name */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Upload from '../views/Upload';
import {Icon} from 'native-base';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';

const TabNavigator = createBottomTabNavigator(
    {
      Home,
      Profile,
      Upload,
    },
    {
      defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: () => {
          const {routeName} = navigation.state;
          let iconName;
          if (routeName === 'Home') {
            iconName = 'home';
          } else if (routeName === 'Profile') {
            iconName = 'person';
          } else if (routeName === 'Upload') {
            iconName = 'add';
          }

          // You can return any component that you like here!
          return <Icon
            name={iconName}
            size={25}
          />;
        },
      }),
      tabBarOptions: {
        activeTintColor: '#000',
      },
    },
);

TabNavigator.navigationOptions = ({navigation}) => {
  const {routeName} = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  const headerTitle = routeName;

  return {
    headerTitle,
  };
};

const StackNavigator = createStackNavigator(
    // RouteConfigs
    {
      Home: {
        screen: TabNavigator,
        navigationOptions: {
          headerMode: 'none', // this will hide the header
          headerLeft: ()=>{}, // this will hide back button
        },
      },
      Single: {
        screen: Single,
      },
      MyFiles: {
        screen: MyFiles,
      },
      Modify: {
        screen: Modify,
      },
      Logout: {
        screen: Login,
      },
    },
);

const Navigator = createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: StackNavigator,
      Auth: Login,
    },
    {
      initialRouteName: 'AuthLoading',
    },
);

export default createAppContainer(Navigator);
