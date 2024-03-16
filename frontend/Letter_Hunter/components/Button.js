import {StyleSheet, View, Pressable, Text, TouchableOpacity, TouchableNativeFeedback} from 'react-native';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import {CameraType} from "expo-image-picker";


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
    console.log(action.assets.length);
}

const openCamera = async () => {
    // Request camera permissions
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
    console.log(action.assets.length);
}


export default function Button({ label, theme }) {
    const [submenuOpen, setSubmenuOpen] = useState(false);

    if (theme === "primary") {
        return (
            <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }, submenuOpen && {height: 68*3}]}>
                <View style={[styles.button, { backgroundColor: "#fff" }]}>
                    <Pressable
                        style={[styles.submenuButton, submenuOpen && { backgroundColor: "#aaa", borderTopLeftRadius: 10, borderTopRightRadius: 10 }, !submenuOpen && {height: "100%"}]}
                        onPress={() => setSubmenuOpen(!submenuOpen)}
                    >
                        <FontAwesome
                        name="picture-o"
                        size={18}
                        color="#25292e"
                        style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
                    </Pressable>
                    {submenuOpen && <ButtonSubmenu iconName="file-picture-o" label="Open Photo Library" onPress={openPhotoLibrary} />}
                    {submenuOpen && <ButtonSubmenu iconName="camera" label="Take a photo" onPress={openCamera} />}
                </View>
            </View>
        );
    }

    return (
    <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={openImagePickerAsync}>
        <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
    </View>
    );
}

function ButtonSubmenu({iconName, label, onPress}) {
    return (
        <Pressable style={[styles.submenuButton]} onPress={onPress} >
            <FontAwesome
                name={iconName}
                size={18}
                color="#25292e"
                style={styles.buttonIcon}
            />
            <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
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
    flexDirection: 'column',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
    submenuButton: {
        width: "100%",
        height: "33.33%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    }
});
