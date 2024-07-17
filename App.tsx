/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Settings from './src/Settings';
import HomeIcon from './src/icons/home';
import SettingsIcon from './src/icons/settings';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import New from './src/sites/New';
import InProgress from './src/sites/InProgress';
import Completed from './src/sites/Completed';

const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="New" component={New} />
      <TopTab.Screen name="InProgress" component={InProgress} />
      <TopTab.Screen name="Completed" component={Completed} />
    </TopTab.Navigator>
  );
};
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              return <HomeIcon />;
            } else if (route.name === 'Settings') {
              return <SettingsIcon />;
            }
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <BottomTab.Screen name="Home" component={TopTabNavigator} />
        <BottomTab.Screen name="Settings" component={Settings} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}

export default App;
