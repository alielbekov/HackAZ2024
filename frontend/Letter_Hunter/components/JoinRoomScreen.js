import {SafeAreaView, StyleSheet, Text, TextInput, View, Platform, StatusBar} from "react-native";
import {useState} from "react";
import {getJoinRoom} from "../api/endpoints";
import {toastError, toastErrorWithMsg} from "./Toasts";
import {globalStyles} from "../styles/globalStyles";
import { TouchableOpacity } from "react-native-web";

export const JoinRoomScreen = ({navigationRef}) => {
  const [roomId, setRoomId] = useState("");

  // Don't allow call to navigate in async function.
  const callNavigate = (response) => {
    navigationRef.navigate("Wait", response);
  };

  const joinARoom = async () => {
    const res = await getJoinRoom(roomId).catch(toastError);

    if (res === undefined) {
      return;
    }

    if (!res.ok) {
      toastErrorWithMsg("Error starting game", new Error(`HTTP error! status: ${res.status}`));
      return;
    }

    let data = await res.json();
    callNavigate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={[styles.title, globalStyles.text]}>Join a Room</Text>
        </View>
        <View style={styles.buttonContainer}>
            <TextInput
                style={styles.textInput}
                placeholder="Type room id here"
                value={roomId}
                onChangeText={(value) => {
                setRoomId(value.toUpperCase());
                }}
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#457EE5"}]} onPress={joinARoom}>
                <Text style={[styles.buttonLabel, globalStyles.text]}>Join Room</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#184e77',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    flex: 1 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: "#ffea00",
    fontSize: 60,
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
    borderRadius: 20,

    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: "center",
    fontSize: 28,
    borderColor: 'green',
    borderWidth: 4,
  },
  buttonLabel: {
    color: '#ffe8d6',
    fontSize: 48,
  },
});
