import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";

const Input = ({ label, isPassword, placeholder, value, setValue, error }) => {
  const [secure, setSecure] = useState(true)
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
        secureTextEntry={ !!isPassword && secure }
        selectionColor={"#0077a799"}
        placeholder={placeholder}
        placeholderTextColor={"#999"}
        value={value}
        onChangeText={setValue}
        style={[styles.input, {borderColor: error && value ? "red" : "#ccc"}]}
        />
        { !!isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.toggleIcon}>
            {secure ? (
              <Ionicons name="eye-outline" size={23} color={"#00597D"} />
            ) : (
              <Ionicons name="eye-off-outline" size={23} color={"#00597D"} />
            )}
          </TouchableOpacity>
          )
        }
      </View>
      {
        error && value && (
          <Text style={{ marginTop: 3, fontFamily: "Nunito_500Medium", fontSize: 14, color: "red", paddingLeft: 10 }}>Please enter a valid {label.toLowerCase()}</Text>
        )
      }
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    label: {
        color: "#00597D",
        fontSize: 14,
        marginLeft: 7,
        fontFamily: "Nunito_600SemiBold"
    },
    input: {
      fontSize: 16,
      fontFamily: "Nunito_500Medium",
      alignSelf: "stretch",
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 10,
      backgroundColor: "#ffffff99",
      marginTop: 5,
      borderWidth: 1,
      color: "black"
    },
    toggleIcon: {
      position: "absolute",
      right: 14,
      top: 34,
    }
})
export default Input