import {Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View} from "react-native";

export const LandingScreen = ({navigationRef}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#25292e'/>
      <View style={styles.logoContainer}>
        <Text style={{color: "white"}}>Letter Hunt</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, {backgroundColor: "#FFF000"}]} onPress={() => navigationRef.navigate("Game")}>
          <Text style={styles.buttonLabel}>Start</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, {backgroundColor: "#457EE5"}]} onPress={() => navigationRef.navigate("Join")}>
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
  logoContainer: {
    flex: 7 / 9,
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
  buttonLabel: {
    color: '#000',
    fontSize: 48,
  },
});