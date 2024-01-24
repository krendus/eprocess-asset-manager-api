import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const AssetCard = ({ name, serialNo, imgSrc, navigation, id, status, returnSrc }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("ViewAsset", {
        id
    })}>
      <View style={styles.imageContainer}>
        <View style={styles.cover}></View>
        <Image source={{ uri:  status === "In possession" ? imgSrc : returnSrc }} style={{ height: 150, width: 150 }} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name.length > 15 ? `${name.substring(0, 15)}...` : name}</Text>
        <Text style={styles.serialNo}>{serialNo}</Text>
        <Text style={[styles.status, {color: status === "In possession" ? "green" : "red"}]}>{status}</Text>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  imageContainer: {
    height: 150,
    width: 150,
    overflow: 'hidden',
  },
  container: {
    height: 220,
    width: 150,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  infoContainer: {
    justifyContent: "center",
    height: 70,
    padding: 7
  },
  name: {
    fontSize: 17,
    fontFamily: "Nunito_600SemiBold"
  },
  serialNo: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Nunito_500Medium"
  },
  status: {
    fontFamily: "Nunito_600SemiBold"
  },
  cover: {
    height: 150,
    width: 150,
    backgroundColor: "#00000066",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9,
  }
})

export default AssetCard