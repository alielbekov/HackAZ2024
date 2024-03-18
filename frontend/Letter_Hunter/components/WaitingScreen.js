import { ScrollView, Pressable, SafeAreaView, StyleSheet, Text, View, StatusBar, Platform } from "react-native";
import {useEffect, useState} from "react";
import {globalStyles} from "../styles/globalStyles";
import socket from '../socket/socketService'

export const WaitingScreen = ({navigationRef, route}) => {
  const [numPlayers, setNumPlayers] = useState(0);
  const [currentUser, setCurrentUser] = useState({ name: '', color: '' });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Emit joinRoom event as soon as the component mounts
    socket.emit('joinRoom', {roomId: route.params.roomId, userId: route.params.userId});
    const updatePlayerNumber = (users) => {
      const usersMap = new Map(Object.entries(users));
      const playerNumber = usersMap.size;
      setNumPlayers(playerNumber);
      
      // Assuming that route.params.userId is the current user's id
      const currentUser = usersMap.get(route.params.userId);
      setCurrentUser({ name: currentUser?.name, color: currentUser?.color });
    
      const usersList = Array.from(usersMap.values()).map(user => ({
        name: user.name,
        color: user.color,
      }));
      setAllUsers(usersList);
    };
    
    const handleGameStart = () => {
      navigationRef.navigate("Game", {
        roomId: route.params.roomId,
        userId: route.params.userId,
      });
    };

    socket.on('updatePlayerNumber', updatePlayerNumber);
    socket.on('startGame', handleGameStart);

    // Clean up by removing listeners when component unmounts
    return () => {
      socket.off('updatePlayerNumber', updatePlayerNumber);
      socket.off('startGame', handleGameStart);
    };
  }, [navigationRef, route.params.roomId, route.params.userId]); // Add dependencies here

  const startGame = () => {
    socket.emit('startGame', {roomId: route.params.roomId});

    navigationRef.navigate("Game", {
      roomId: route.params.roomId,
      userId: route.params.userId,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable style={styles.button}>
          <Text style={[styles.titleLabel, globalStyles.text]}>{`Room ID: ${route.params.roomId}`}</Text>
        </Pressable>
      </View>
      <View style={styles.currentUserContainer}>
        <Text style={[styles.label, { color: currentUser.color }]}>{`You: ${currentUser.name}`}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.label, globalStyles.text]}>{`Number of players: ${numPlayers}`}</Text>
        <ScrollView style={styles.usersList}>
          {allUsers.map((user, index) => (
            <Text key={index} style={[styles.userLabel, { color: user.color }]}>{user.name}</Text>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, {backgroundColor: "#457EE5"}]} onPress={startGame}>
          <Text style={[styles.buttonLabel, globalStyles.text]}>Start game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#184e77',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 0 : StatusBar.currentHeight,
  },
  titleContainer: {
    flex: 1 / 3,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1 / 3,
    width: 320,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    margin: 10,
  },
  button: {
    backgroundColor: "#FFF000",
    borderRadius: 10,

    width: '100%',
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: "#aaa",
    borderRadius: 5,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: "center",
    fontSize: 28,
  },
  label: {
    color: '#fff',
    fontSize: 35,
    margin: 20,
  },
  titleLabel: {
    color: '#000',
    fontSize: 30,
  },
  buttonLabel: {
    color: '#ffe8d6',
    fontSize: 23,
  },
});