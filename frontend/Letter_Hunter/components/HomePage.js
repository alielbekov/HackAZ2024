import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
  const handlePlaySoloPress = async () => {
      // Fetch request to the server to get room and user IDs
  const response = await fetch('http://localhost:3000/start'); // Ensure correct port number
  const data = await response.json();

  // Extracting room ID and user ID from response
  const { roomId, userId } = data;

  // Navigate to Game Page with room ID and user ID
  navigation.navigate('Game Page', { roomId, userId });

  };

  const handleJoinRoomPress = () => {
    // Handle Join Room button press
    console.log('Join Room pressed');
    // For navigation: navigation.navigate('YourJoinRoomPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePlaySoloPress}>
        <Text style={styles.buttonText}>Play Solo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinRoomPress}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    backgroundColor: '#fff', // White background
  },
  button: {
    backgroundColor: '#007bff', // Blue background
    padding: 15,
    borderRadius: 5,
    margin: 10, // Add margin for vertical spacing between buttons
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontSize: 16,
  },
  // Add more styles as needed
});

export default HomePage;
