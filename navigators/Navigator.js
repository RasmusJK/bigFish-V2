/* eslint-disable react/display-name */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Market from '../views/Market'
import Profile from '../views/Profile';
import Single from '../views/Single';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Upload from '../views/Upload';
import {Icon, Image, Thumbnail, View} from 'native-base';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import {colors, button, icon, text} from '../constants/stylingConstants';

const TabNavigator = createBottomTabNavigator(
    {
        Home,
        Market,
        Profile,
        Upload,
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, color, size}) => {
                const {routeName} = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = focused ? 'home' : 'home';
                } else if (routeName === 'Market') {
                    iconName = focused ? 'cash' : 'cash';
                } else if (routeName === 'Profile') {
                    iconName = focused ? 'person' : 'person';
                } else if (routeName === 'Upload') {
                    iconName = focused ? 'add' : 'add';
                }

                // You can return any component that you like here!
                if (focused) {
                    return (
                        <Icon
                            name={iconName}
                            size={25}
                            style={{color: colors.colorContrast}}
                        />)
                        ;
                } else {
                    return (
                        <Icon
                            name={iconName}
                            size={25}
                            style={{color: colors.colorSecondaryShade}}
                        />)
                }
            },
        }),
        tabBarOptions: {
            activeTintColor: colors.colorContrast,
            style: {
                backgroundColor: colors.colorSecondary,
            },
            inactiveTintColor: colors.colorSecondaryShade,
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
                headerTintColor: colors.colorPrimary,
                headerStyle: {
                    backgroundColor: colors.colorSecondary,
                },
                headerMode: 'none', // this will hide the header
                headerLeft: () => {
                }, // this will hide back button
            },
        },
        Single: {
            screen: Single,
            navigationOptions: {
                headerTintColor: colors.colorPrimary,
                headerStyle: {
                    backgroundColor: colors.colorSecondary,
                },
            }
        },
        MyFiles: {
            screen: MyFiles,
            navigationOptions: {
                headerTintColor: colors.colorPrimary,
                headerStyle: {
                    backgroundColor: colors.colorSecondary,
                }
            }
        },
        Modify: {
            screen: Modify,
            navigationOptions: {
                headerTintColor: colors.colorPrimary,
                headerStyle: {
                    backgroundColor: colors.colorSecondary,
                }
            }
        },
        Logout: {
            screen: Login,
            navigationOptions: {
                headerTintColor: colors.colorPrimary,
                headerStyle: {
                    backgroundColor: colors.colorSecondary,
                }
            },
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
