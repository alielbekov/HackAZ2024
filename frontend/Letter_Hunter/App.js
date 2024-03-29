import React from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LandingScreen} from "./components/LandingScreen";
import GamePage from './components/GamePage';
import {JoinRoomScreen} from "./components/JoinRoomScreen";
import {Image, Text, TouchableOpacity} from 'react-native'; // Make sure to import Text here
import {Chewy_400Regular, useFonts} from '@expo-google-fonts/chewy';
import {globalStyles} from './styles/globalStyles';
import Toast from "react-native-toast-message";
import {WaitingScreen} from "./components/WaitingScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  const navigationRef = useNavigationContainerRef();
  let [fontsLoaded] = useFonts({
    Chewy_400Regular,
  });

  if (!fontsLoaded) {
    return;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}>
          {() => <LandingScreen navigationRef={navigationRef}/>}
        </Stack.Screen>
        <Stack.Screen 
        name="Join"
        options={() => ({
            headerTitle: "",
            headerTintColor: 'white',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: '#184e77',
            }
        })}>
          {() => <JoinRoomScreen navigationRef={navigationRef}/>}
        </Stack.Screen>
        <Stack.Screen
          name="Wait"
          options={() => ({
            headerTitle: '',
            headerShadowVisible: false,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#184e77',

            },
          })
          }>
          {(props) => <WaitingScreen navigationRef={navigationRef} route={props.route}/>}
        </Stack.Screen>
        <Stack.Screen
          name="Game"
          component={GamePage}
          options={({navigation}) => ({
            headerTitle: '',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#184e77',

            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}
                                style={{
                                  borderRadius: 17,
                                  backgroundColor: '#2a9d8f',
                                  padding: 10,
                                  margin: 10,
                                  flexDirection: 'row'
                                }}>
                <Image source={require('./assets/leave-room.png')}
                       style={{width: 20, height: 25, backgroundColor: '#2a9d8f', marginRight: 2}}/>
                <Text style={[{fontSize: 18, color: '#ffe8d6'}, globalStyles.text]}>Leave Room</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
      <Toast/>
    </NavigationContainer>
  );
}