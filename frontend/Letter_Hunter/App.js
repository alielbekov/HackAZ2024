import {StyleSheet, Text, View, Image, StatusBar, SafeAreaView} from 'react-native';

import Button from './components/Button';

const PlaceholderImage = require('./assets/road-1072821_1920.jpg');
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#25292e'/>
      <View>
        <Text style={{color: 'white'}}>Letter Hunter</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image}/>
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Take a photo"/>
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
    flex: 1,
    paddingTop: 20,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 20,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
