import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import {CameraType} from "expo-image-picker";
import Toast from "react-native-toast-message";
import {toastError} from "./Toasts";
import {globalStyles} from "../styles/globalStyles";


export default function Button({label, onImagePicked}) {
  const handleImagePicked = (uri) => {
    console.log("sending img uri");

    onImagePicked(uri); // Update the App component's state with the new image URI
  };

  const openCamera = async () => {
    // Request camera permissions
    console.log("opening cam");
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync().catch(toastError);

    if (cameraPermission === undefined) {
      return;
    }

    if (cameraPermission.status !== 'granted') {
      Toast.show({
        type: "error",
        text1: 'Permission to access camera was denied'
      });
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
