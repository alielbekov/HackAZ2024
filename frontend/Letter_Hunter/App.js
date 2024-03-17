import React from 'react';

import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LandingScreen} from "./components/LandingScreen";
import GamePage from './components/GamePage';
import {JoinRoomScreen} from "./components/JoinRoomScreen";


const Stack = createNativeStackNavigator();

export default function App() {

  const navigationRef = useNavigationContainerRef();
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {() => <LandingScreen navigationRef={navigationRef}/>}
        </Stack.Screen>
        <Stack.Screen name="Join">
          {() => <JoinRoomScreen navigationRef={navigationRef}/>}
        </Stack.Screen>
        <Stack.Screen name="Game" component={GamePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
