import { View, Text, StyleSheet, Button, Touchable, TouchableHighlight, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const DatePicker = ({ date, setDate, label }) => {
  const handleUpdate = (event, selectedDate ) => {
    setDate(selectedDate);
  }
  const handleShowPicker = () => {
    Date
    DateTimePickerAndroid.open({
        value: date,
        onChange: handleUpdate,
        display: 'spinner',
        mode: "date",
    })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={handleShowPicker} style={styles.input}>
        <Text style={styles.text}>{date.toDateString()}</Text>
      </TouchableOpacity>
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
        borderColor: "#ccc",
        borderWidth: 1,
        color: "black",
        height: 50,
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        fontFamily: "Nunito_500Medium",
        color: "black"
    }
})
export default DatePicker