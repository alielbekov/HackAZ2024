import {Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {postJoinRoom} from "../api/endpoints";

export const JoinRoomScreen = ({ navigationRef }) => {
  const [roomId, setRoomId] = useState("");

  const joinARoom = async () => {
    const res = postJoinRoom({
      roomId,
      userId: "userIdPlaceholder"
    });

    if (res.status !== 200) {
      return;
    }

    navigationRef.navigate("Game");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#25292e'/>
      <View style={styles.titleContainer}>
        <Text style={{color: "white", fontSize: 48}}>Join a room</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TextInput style={styles.textInput} placeholder="Type room id here" onChangeText={setRoomId}/>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, {backgroundColor: "#FFF000"}]} onPress={joinARoom}>
          <Text style={styles.buttonLabel}>Join Room</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    flex: 1 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: 320,
    height: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    margin: 10,
  },
  button: {
    backgroundColor: "#aaa",
    borderRadius: 5,

    width: '100%',
    height: '100%',
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
  buttonLabel: {
    color: '#000',
    fontSize: 48,
  },
});
