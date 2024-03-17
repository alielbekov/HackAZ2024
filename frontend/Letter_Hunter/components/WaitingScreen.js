import {Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {globalStyles} from "../styles/globalStyles";

export const WaitingScreen = ({ navigationRef, route }) => {
  const [numPlayers, setNumPlayers] = useState(0);

  useEffect(() => {
    //todo: connect to join-room socket and update numPlayers.
    //todo: connect to start game socket and navigate to game page when told.
  }, []);

  const startGame = () => {
    navigationRef.navigate("Game", {
      roomId: route.params.roomId,
      userId: route.params.userId,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable style={styles.button} onPress={() => console.log("todo: save to clipboard")}>
          <Text style={[styles.buttonLabel, globalStyles.text]}>{`Room ID: ${route.params.roomId}`}</Text>
        </Pressable>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.label, globalStyles.text]}>{`Number of players: ${numPlayers}`}</Text>
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
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    borderRadius: 5,

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
    fontSize: 20,
    margin: 20,
  },
  buttonLabel: {
    color: '#000',
    fontSize: 30,
  },
});