import {StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import stringifySafe from "@expo/metro-runtime/build/error-overlay/modules/stringifySafe";
import {fetchGetWord} from "../api/endpoints";

export const WordProgress = ({foundLetters, setServerResponse}) => {
  const [word, setWord] = useState("Placeholder");

  useEffect(() => {
    const fetchWord = async () => {
      const res = fetchGetWord().catch((error) => { setServerResponse(stringifySafe(error)); });

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
                     style={[styles.textStyle, found && {color: "white"}, !found && {color: "#555"}]}>{character}</Text>;
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
    fontSize: 48,
  }
});