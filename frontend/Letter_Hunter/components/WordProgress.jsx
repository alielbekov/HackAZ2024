import {StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import stringifySafe from "@expo/metro-runtime/build/error-overlay/modules/stringifySafe";
import {fetchGetWord} from "../api/endpoints";

export const WordProgress = ({foundLetters, setServerResponse, roomId}) => {
  const [word, setWord] = useState("Placeholder");
  useEffect(() => {
    const fetchWord = async () => {
      console.log("Attempting to fetch word with roomId:", roomId); // Debugging log
      if (!roomId) {
        console.log("No roomId available, skipping fetch");
        return; // Early return if roomId is not available
      }

      try {
        const response = await fetchGetWord(roomId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWord(data.currentWord);
      } catch (error) {
        console.error('Fetch error:', error);
        setServerResponse(`Error fetching word: ${error.toString()}`);

      }
    };

    fetchWord();
  }, [roomId, setServerResponse]); // Use roomId in the dependency array

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
    flexWrap: 'wrap',
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 48,
  }
});