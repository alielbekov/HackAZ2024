import {StyleSheet, View, Pressable, Text, TouchableOpacity} from 'react-native';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import {CameraType} from "expo-image-picker";
import {globalStyles} from "../styles/globalStyles";

export default function Button({ label, theme, onImagePicked}) {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const handleImagePicked = (uri) => {
        console.log("sending img uri");
        
        onImagePicked(uri); // Update the App component's state with the new image URI
        setSubmenuOpen(false); // Optionally close the submenu
    };
    const openPhotoLibrary = async () => {
        // Request media library permissions
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryPermission.status !== 'granted') {
            alert('Permission to access gallery was denied');
            return;
        }
    
        // Show an action sheet to choose between camera and gallery
        const action = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        
    
        if (action.canceled) {
            return;
        }
        // Here you can handle the selected image URI, display it, or upload it
        // console.log(action);
        handleImagePicked(action);
    }
    
    const openCamera = async () => {
        // Request camera permissions
        console.log("opening cam");
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            alert('Permission to access camera was denied');
            return;
        }
    
        const action = await ImagePicker.launchCameraAsync({
            allowsEditing: true, // allow cropping and rotation
            cameraType: CameraType.back
        });
    
        if (action.canceled) {
            return;
        }
    
        // Here you can handle the selected image URI, display it, or upload it
        // console.log(action.assets);
        handleImagePicked(action);
    }

    if (theme === "primary") {
        return (
            <View style={[styles.buttonContainer, {borderRadius: 18}]}>
              <TouchableOpacity style={[styles.button, {backgroundColor: "#0077b6"}]} onPress={openCamera}>
                <FontAwesome
                    name="camera"
                    size={18}
                    color="#ffe8d6"
                    style={styles.buttonIcon}
                />
                <Text style={[styles.buttonLabel, {color: "#ffe8d6", fontSize: 23}, globalStyles.text]}>{label}</Text>
              </TouchableOpacity>
            </View>
          );
    };
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    // marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    alignItems: 'center',
  },
});
