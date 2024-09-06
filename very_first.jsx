import React, {useState} from 'react';
import {Text, View, TextInput, Button, StyleSheet, SafeAreaView} from 'react-native';

const YourApp = () => {
  const [message, setMessage] = useState("Try editing me! 🎉");
  const [input, setInput] = useState("");

  const handlePress = () => {
    if (input.trim()) {
      setMessage(input);
    } else {
      setMessage("Please enter something!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to My First React Native App</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.displayText}>{message}</Text>

        {/* Input field to take user input */}
        <TextInput
          style={styles.input}
          placeholder="Type a new message..."
          value={input}
          onChangeText={(text) => setInput(text)}
        />

        {/* Button to update message */}
        <Button title="Update Message" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

export default YourApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'wheat',
    justifyContent: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  displayText: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
  },
});
