
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, SafeAreaView, Alert, ScrollView, Dimensions } from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard'; // Updated import
import Button from './Button';
import { WordProgress } from "./WordProgress";
import {postImage, getFoundLetters} from "../api/endpoints";
const cameraPlaceholder = require('../assets/cam-placeholder.png');
import socket from '../socket/socketService'
import {globalStyles} from "../styles/globalStyles";


export default function GamePage({route, navigation}) {
    const [imageUri, setImageUri] = useState(null);
    const [serverResponse, setServerResponse] = useState('');
    const [foundLetters, setFoundLetters] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');

    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{backgroundColor: '#2a9d8f', borderRadius: 17, padding: 10, justifyContent:'center', margin: '10px'}}>
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
        socket.emit('joinRoom', { roomId, userId });
      }
    }, [roomId]); // Depend on roomId to ensure it's set before calling
    const copyToClipboard = () => {
        // Clipboard.setString(roomId);
        // Alert.alert('Copied', 'Room ID has been copied to clipboard.');
    };

    const uploadImage = async (uri) => {
        try {
          const response = await postImage({
            imageBase64: uri,
            roomId: roomId,
            userId: userId
          });
    
          // if (!response.ok) {
          //   throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          // }
          if (response.status !== 200) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }else{
            response.json().then((data) => {
              const {isGameOver} = data;
              if(isGameOver){
                console.log('Game Over');
                socket.emit('gameOver', { roomId });
              }


            });
            console.log('Image uploaded successfully');
            socket.emit('lettersUpdated', { roomId });
          }
    
          
        } catch (error) {
          console.error('Error uploading image:', error);
          setServerResponse('Error uploading image:. ' + error.message);
        }
      };

    const updateFoundLetters = async () => {

        try {
          console.log('Updating found letters')
          const response = await getFoundLetters(roomId);
    
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }
    
          await response.json().then((data) => {
            setFoundLetters(data.lettersFound);
          });
        } catch (error) {
          console.error('Error updating found letters:', error);
          setServerResponse('Error updating found letters: ' + error.message);
        }
      }



    const handleImage = (images) => {
    setImageUri(images.assets[0].uri);
    uploadImage(images.assets[0].uri); // Additionally upload the image
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{flex: 1}}>
            <View style={styles.container}>
                <StatusBar backgroundColor="#25292e" />
                <View>
                        <Text style={[{ color: "white", fontSize: 45, color: '#ffea00' }, globalStyles.text]}>Find Letters</Text>
                </View>
                {/* <View style={styles.roomIdContainer}>
                    <Text style={styles.roomIdText}>Room ID: {roomId}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                        <Text style={styles.copyButtonText}>Copy</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.currentWord}>
                    <WordProgress foundLetters={foundLetters} setServerResponse={setServerResponse} roomId={roomId} />
                </View>
                <View style={styles.imageContainer}>
                    <Image source={imageUri ? { uri: imageUri } : cameraPlaceholder} style={styles.image} resizeMode="cover" />
                </View>
                {/* <View style={styles.serverResponse}>
                    <Text style={{ padding: 5 }}>Server Response: {serverResponse}</Text>
                </View> */}
                <View style={styles.footerContainer}>
                    <Button theme="primary" label="Take a photo" onImagePicked={handleImage} />
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
        backgroundColor:'yellow',
      },
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#184e77',
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
    serverResponse: {
      // flex: 1,
      marginTop: 20,
      backgroundColor: 'white',
      minHeight: 50,
      width: 320,
      borderRadius: 10,
    },
    footerContainer: {
      flex: 1 / 3,
      marginTop: 50,
      alignItems: 'center',
    },
    currentWord: {
        flexWrap: 'wrap', // Encourage wrapping
        flexDirection: 'row', // Layout children in a row; adjust as needed
        minWidth: 200,
        maxWidth: '90%', // Prevent it from exceeding the screen width
        alignItems: 'center', // Center items for aesthetics; adjust as needed
        justifyContent: 'center', // Center content horizontally; adjust as needed
        padding: 10, // Add some padding to prevent text from touching edges
    },      
    word: {
      fontSize: 30,
      fontWeight: 'bold',
    }
  });
  
