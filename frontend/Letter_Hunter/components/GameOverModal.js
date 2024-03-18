import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from "../styles/globalStyles";

const GameOverModal = ({ visible, usersObj, onClose }) => {
  // Convert users object to an array and sort by score in descending order
  const sortedUsers = Object.entries(usersObj)
    .map(([userId, user]) => ({ userId, ...user }))
    .sort((a, b) => b.score - a.score);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <Text style={[styles.modalTitle, globalStyles.text]}>Game Over - Scores</Text>
        <ScrollView style={styles.scrollView}>
          {sortedUsers.map((user, index) => (
            <View key={user.userId} style={[styles.userContainer, globalStyles.text]}>
              <Text style={[styles.rank, globalStyles.text]}>
                #{index + 1}
              </Text>
              <Text style={[styles.userName, globalStyles.text]}>
                {user.name}: {user.score}
              </Text>
            </View>
          ))}
        </ScrollView>
        <Text style={[styles.closeText, globalStyles.text]} onPress={onClose}>Close</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "#102a44", // Darker blue background
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#ffea00", // Yellow text for title
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row', // Align rank and username in one line
    alignItems: 'center', // Align items vertically
    marginBottom: 20,
    backgroundColor: "#2a9d8f", // Lighter blue for card-like elements
    borderRadius: 10,
    padding: 10,
  },
  rank: {
    marginRight: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: "#ffea00", // Bright yellow text
  },
  userName: {
    fontSize: 16,
    color: "#ffe8d6", // Lighter text for username to ensure readability
  },
  closeText: {
    marginTop: 20,
    color: '#ffea00',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffea00', // Bright yellow border
  },
  scrollView: {
    maxHeight: "80%", // Prevent modal from taking full screen height
  }
});

export default GameOverModal;
