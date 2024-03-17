import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomePage from './components/HomePage'; // Import your new HomePage component
import GamePage from './components/GamePage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Game Page" component={GamePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
