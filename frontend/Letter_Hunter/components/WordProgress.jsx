import {StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {fetchGetWord} from "../api/endpoints";
import {toastError, toastErrorWithMsg} from "./Toasts";

export const WordProgress = ({foundLetters, roomId}) => {
  const [word, setWord] = useState("Placeholder");
  useEffect(() => {
    const fetchWord = async () => {
      console.log("Attempting to fetch word with roomId:", roomId); // Debugging log
      if (!roomId) {
        console.log("No roomId available, skipping fetch");
        return; // Early return if roomId is not available
      }

      const response = await fetchGetWord(roomId).catch(toastError);

      if (response === undefined) {
        return;
      }

      if (!response.ok) {
        toastErrorWithMsg("Error fetching word", new Error(`HTTP error! status: ${response.status}`));
        return;
      }

      const data = await response.json();
      setWord(data.currentWord);
    };

    fetchWord();
  }, [roomId]); // Use roomId in the dependency array

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
    fontSize: 30,
  }
});