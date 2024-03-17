import {StyleSheet, View, Pressable, Text} from 'react-native';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import {CameraType} from "expo-image-picker";
import Toast from "react-native-toast-message";
import {toastError} from "./Toasts";

export default function Button({ label, theme, onImagePicked}) {
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

    if (theme === "primary") {
        return (
            <View style={[styles.buttonContainer, {borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18}]}>
              <Pressable style={[styles.button, {backgroundColor: "#fff"}]} onPress={openCamera}>
                <FontAwesome
                    name="camera"
                    size={18}
                    color="#25292e"
                    style={styles.buttonIcon}
                />
                <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
              </Pressable>
            </View>
          );
    }

  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, {borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18}]}>
        <Pressable style={[styles.button, {backgroundColor: "#fff"}]} onPress={openCamera}>
          <FontAwesome
            name="camera"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

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
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
