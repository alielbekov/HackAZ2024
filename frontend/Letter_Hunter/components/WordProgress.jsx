import {StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import stringifySafe from "@expo/metro-runtime/build/error-overlay/modules/stringifySafe";

export const WordProgress = ({foundLetters, setServerResponse}) => {
  const [word, setWord] = useState("Placeholder");

  useEffect(() => {
    const fetchWord = async () => {
      const res = await fetch("http://137.184.74.25:3000/get-word")
        .catch((error) => { setServerResponse(stringifySafe(error)); });

      if (res !== undefined) {
        res.json().then((data) => {
          setWord(data.currentWord);
        })
        .catch((error) => {
          setServerResponse(stringifySafe(error));
        });
      }
    };

    fetchWord();
  }, [word, setServerResponse]);

  return (
    <View style={styles.wordContainer}>
      {[...word].map((character, index) => {
        const found = foundLetters.find((x) => x === character.toLowerCase()) !== undefined;
        return <Text key={index}
                     style={[styles.textStyle, found && {color: "white"}, !found && {color: "#aaa"}]}>{character}</Text>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 40,
  }
});