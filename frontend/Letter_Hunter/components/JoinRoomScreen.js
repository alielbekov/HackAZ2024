import {SafeAreaView, StatusBar, StyleSheet, Text, View} from "react-native";

export const JoinRoomScreen = ({navigationRef}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#25292e'/>
      <View style={styles.logoContainer}>
        <Text style={{color: "white"}}>Join a room</Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
