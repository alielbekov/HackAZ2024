
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard'; // Updated import
import Button from './Button';
import { WordProgress } from "./WordProgress";
import {postImage} from "../api/endpoints";
const PlaceholderImage = require('../assets/road-1072821_1920.jpg');

export default function GamePage({route}) {
    const [imageUri, setImageUri] = useState(null);
    const [serverResponse, setServerResponse] = useState('');
    const [foundLetters, setFoundLetters] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
      if (route.params) {
          const { roomId, userId } = route.params;
          setRoomId(roomId);
          setUserId(userId);
      }
    }, [route.params]);

    const copyToClipboard = () => {
        Clipboard.setString(roomId);
        Alert.alert('Copied', 'Room ID has been copied to clipboard.');
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
    
          await response.json().then((data) => {
            setFoundLetters(data.lettersFound);
            setServerResponse('Letters found: ' + data.lettersFound.join(', '));
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          setServerResponse('Error uploading image:. ' + error.message);
        }
      };



    const handleImage = (images) => {
    setImageUri(images.assets[0].uri);
    uploadImage(images.assets[0].uri); // Additionally upload the image
    };


    return (
      <View style={styles.container}>
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
              <WordProgress foundLetters={foundLetters} setServerResponse={setServerResponse} roomId={roomId} />
          </View>
          <View style={styles.imageContainer}>
              <Image source={imageUri ? { uri: imageUri } : PlaceholderImage} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.serverResponse}>
              <Text style={{ padding: 5 }}>Server Response: {serverResponse}</Text>
          </View>
          <View style={styles.footerContainer}>
              <Button theme="primary" label="Take a photo" onImagePicked={handleImage} />
          </View>
      </View>

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
      flex: 1 / 5,
      minWidth: 200,
    },
    word: {
      fontSize: 30,
      fontWeight: 'bold',
    }
  });
  
