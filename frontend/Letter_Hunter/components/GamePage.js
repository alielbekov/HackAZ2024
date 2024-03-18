import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, StatusBar, ScrollView, Platform} from 'react-native';
import Button from './Button';
import {WordProgress} from "./WordProgress";
import {postImage, getFoundLetters} from "../api/endpoints";

const cameraPlaceholder = require('../assets/cam-placeholder.png');
import socket from '../socket/socketService'
import {toastError, toastErrorWithMsg} from "./Toasts";
import {readAsStringAsync} from "expo-file-system";
import {globalStyles} from "../styles/globalStyles";


export default function GamePage({route, navigation}) {
  const [imageUri, setImageUri] = useState(null);
  const [foundLetters, setFoundLetters] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{backgroundColor: '#2a9d8f', borderRadius: 17, padding: 10, justifyContent: 'center', margin: 10}}>
          <Text style={[{color: '#ffe8d6', fontSize: 18}, globalStyles.text]}>Room Id: {roomId}</Text>
        </View>
      ),
    });
  }, [navigation, roomId]);
  useEffect(() => {
    const handleNewPlayer = (userId) => {
      console.log('New Player joined:', userId);
      // Handle new player joining the game
    };

    const handleLettersUpdated = (data) => {
      console.log('Found letters updated:', data);
      setFoundLetters(data); // Assuming the server sends an array of found letters
    };

    const handleGameOver = (data) => {
      const {imagesList} = data;
      console.log(imagesList);
      console.log('Game Over!');
    };

    // Set up socket event listeners
    socket.on('newPlayer', handleNewPlayer);
    socket.on('lettersUpdated', handleLettersUpdated);
    socket.on('gameOver', handleGameOver);

    // Cleanup function
    return () => {
      socket.off('newPlayer', handleNewPlayer);
      socket.off('lettersUpdated', handleLettersUpdated);
      socket.off('gameOver', handleGameOver);
    };
  }, []);


  useEffect(() => {
    if (route.params) {
      const {roomId, userId} = route.params;
      setRoomId(roomId);
      setUserId(userId);
    }

  }, [route.params]);


  useEffect(() => {
    // Only call updateFoundLetters if roomId is not null or undefined
    if (roomId) {
      updateFoundLetters();
    }
  }, [roomId]); // Depend on roomId to ensure it's set before calling

  const uploadImage = async (uri) => {
    const response = await postImage({
      imageBase64: uri,
      roomId: roomId,
      userId: userId
    }).catch(toastError);

    if (response === undefined) {
      return;
    }

    if (!response.ok) {
      toastErrorWithMsg("Error uploading image", new Error(`Server responded with ${response.status}: ${response.statusText}`));
      return;
    }

    response.json().then((data) => {
      const {isGameOver} = data;
      if (isGameOver) {
        console.log('Game Over');
        socket.emit('gameOver', {roomId});
      }
    });

    console.log('Image uploaded successfully');
    socket.emit('lettersUpdated', {roomId});
  };

  const updateFoundLetters = async () => {
    console.log('Updating found letters');
    const response = await getFoundLetters(roomId).catch(toastError);

    if (response === undefined) {
        return;
    }

    if (!response.ok) {
        toastErrorWithMsg("Error updating found letters", new Error(`Server responded with ${response.status}: ${response.statusText}`));
        return;
    }

    await response.json().then((data) => {
        // Assuming the API response structure matches our expectations
        setFoundLetters(data.lettersFound);
    });
}

  const handleImage = async (images) => {
    setImageUri(images.assets[0].uri);
    const uri = images.assets[0].uri;

    if (uri.includes("file://")) {
      console.log(`Reading ${uri}...`);
      await readAsStringAsync(uri, {
        encoding: "base64"
      })
        .then((data) => uploadImage(`data:image/jpeg;base64,${data}`))
        .catch(toastError);
    } else {
      await uploadImage(uri);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#25292e"/>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, globalStyles.text]}>Find Letters</Text>
        </View>

        <View style={styles.currentWord}>
          <WordProgress foundLetters={foundLetters} roomId={roomId}/>
        </View>
        <View style={styles.imageContainer}>
          <Image source={imageUri ? {uri: imageUri} : cameraPlaceholder} style={styles.image} resizeMode="cover"/>
        </View>
        {/* <View style={styles.serverResponse}>
                    <Text style={{ padding: 5 }}>Server Response: {serverResponse}</Text>
                </View> */}
        <View style={styles.footerContainer}>
          <Button label="Take a photo" onImagePicked={handleImage}/>
        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({

  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#184e77',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  imageContainer: {
    // flex: 1,
    paddingTop: 20,
    width: 320,
    height: 440,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  footerContainer: {
    flex: 1 / 3,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  currentWord: {
    flexWrap: 'wrap', // Encourage wrapping
    flexDirection: 'row', // Layout children in a row; adjust as needed
    minWidth: 200,
    maxWidth: '90%', // Prevent it from exceeding the screen width
    alignItems: 'center', // Center items for aesthetics; adjust as needed
    justifyContent: 'center', // Center content horizontally; adjust as needed
    padding: 5, // Add some padding to prevent text from touching edges
    marginBottom: 10,
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 45,
    color: '#ffea00'
  }
});
  
