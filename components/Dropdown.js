import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SelectList } from 'react-native-dropdown-select-list';

const Dropdown = ({ data, placeholder, setValue, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <SelectList 
        save="value"
        setSelected={setValue}
        data={data}
        placeholder={placeholder}
        fontFamily="Nunito_500Medium"
        boxStyles={{
          borderRadius: 10,
          backgroundColor: "#ffffff99",
          borderColor: "#ccc",
          marginTop: 5,
          height: 50,
          alignItems: "center"
        }}
        dropdownStyles={{
          backgroundColor: "#ffffff99",
          borderColor: "#ccc",
        }}
        dropdownItemStyles={{
          height: 40
        }}
        inputStyles={{
          color: "#000",
          fontFamily: "Nunito_500Medium",
          fontSize: 16
        }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
      marginBottom: 20
  },
  label: {
      color: "#00597D",
      fontSize: 14,
      fontFamily: "Nunito_600SemiBold",
      marginLeft: 7,
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
      borderColor: "#ccc",
      borderWidth: 1,
      color: "black"
  }
})

export default Dropdown