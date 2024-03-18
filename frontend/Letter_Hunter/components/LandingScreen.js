import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar} from "react-native";
import {fetchStartIds} from "../api/endpoints";
import {globalStyles} from "../styles/globalStyles";
import {toastError, toastErrorWithMsg} from "./Toasts";

const backgroundImage = require('../assets/background-image.jpg');
export const LandingScreen = ({navigationRef}) => {
  // Don't allow call to navigate in async function.
  const callNavigate = (response) => {
    navigationRef.navigate("Wait", response);
  };

  const handleStart = async () => {
    const res = await fetchStartIds().catch(toastError);

    if (!res.ok) {
      toastErrorWithMsg("Error starting game", new Error(`HTTP error! status: ${res.status}`));
      return;
    }

    const data = await res.json();
    callNavigate(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.image} blurRadius={10}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Text style={[styles.textFont, globalStyles.text]}>Letter Hunt</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#f77f00"}]} onPress={handleStart}>
              <Text style={[styles.buttonLabel, globalStyles.text]}>Start</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#457EE5"}]}
                              onPress={() => navigationRef.navigate("Join")}>
              <Text style={[styles.buttonLabel, globalStyles.text]}>Join Room</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 7 / 9,
    justifyContent: "center",
    // backgroundColor: 'white',
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

    width: '90%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#ffe8d6',
    fontSize: 48,
  },

  textFont: {
    fontSize: 100,
    color: '#ffea00',
    textAlign: 'center',
  },
});
