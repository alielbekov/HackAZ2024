import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, SafeAreaView} from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard'; // Updated import
import Button from './Button';
import { WordProgress } from "./WordProgress";
import {postImage, getFoundLetters} from "../api/endpoints";
const PlaceholderImage = require('../assets/road-1072821_1920.jpg');
import socket from '../socket/socketService'
import Toast from "react-native-toast-message";
import {toastError, toastErrorWithMsg} from "./Toasts";
import {readAsStringAsync} from "expo-file-system";

export default function GamePage({route}) {
    const [imageUri, setImageUri] = useState(null);
    const [foundLetters, setFoundLetters] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');

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
          const { roomId, userId } = route.params;
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
    const copyToClipboard = () => {
        // Clipboard.setString(roomId);
        Toast.show({
          type: "success",
          text1: 'Copied',
          text2: 'Room ID has been copied to clipboard.'
        });
    };

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
        if(isGameOver){
          console.log('Game Over');
          socket.emit('gameOver', { roomId });
        }
      });
      
      console.log('Image uploaded successfully');
      socket.emit('lettersUpdated', { roomId });
    };

    const updateFoundLetters = async () => {
      console.log('Updating found letters')
      const response = await getFoundLetters(roomId).catch(toastError);

      if (response === undefined) {
        return;
      }

      if (!response.ok) {
        toastErrorWithMsg("Error updating found letters", new Error(`Server responded with ${response.status}: ${response.statusText}`));
        return;
      }

      await response.json().then((data) => {
        setFoundLetters(data.lettersFound);
      });
    }



    const handleImage = async (images) => {
      setImageUri(images.assets[0].uri);
      const uri = images.assets[0].uri;

      if (uri.includes("file://")) {
        console.log(uri);
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
      <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#25292e" />
          <View>
              <Text style={{ color: "white" }}>Letter Hunter</Text>
          </View>
          <View style={styles.roomIdContainer}>
              <Text style={styles.roomIdText}>Room ID: {roomId}</Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.currentWord}>
              <WordProgress foundLetters={foundLetters} roomId={roomId} />
          </View>
          <View style={styles.imageContainer}>
              <Image source={imageUri ? { uri: imageUri } : PlaceholderImage} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.footerContainer}>
              <Button theme="primary" label="Take a photo" onImagePicked={handleImage} />
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
    imageContainer: {
      // flex: 1,
      paddingTop: 20,
      width: 320,
      height: 440,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'lightgreen',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    footerContainer: {
      flex: 1 / 3,
      marginTop: 50,
      alignItems: 'center',
    },
    currentWord: {
      flex: 1 / 5,
      minWidth: 200,
    },
    word: {
      fontSize: 30,
      fontWeight: 'bold',
    }
  });
  
