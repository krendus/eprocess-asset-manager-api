import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from "react-native-vector-icons/Feather"
import { observer } from 'mobx-react-lite';
import { useUserStore } from '../../store/user.store';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useStatusStore } from '../../store/status.store';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllAssetRequest } from '../../api/assets';
// import { auth, getAllAsset } from '../../firebase';

const Profile = observer(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {user, removeUser } = useUserStore();
  const { setStatus } = useStatusStore();
  const handleLogout = () => {
    removeUser();
    AsyncStorage.removeItem("token");
    setStatus(false);
  }
  const [assets, setAssets] = useState([]);

  const handleGetAssetsResponse = (data, message) => {
    if(data) {
        setAssets(data);
    } else {
      if(Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT)
      } else {    
          Alert.alert("Error", message);
      }
    }
  }
  const handleGetAssets = () => {
    getAllAssetRequest()
    .then((res) => {
      if(res.data.status === "success") {
        handleGetAssetsResponse(res.data.data, res.data.message);
      } else {
        handleGetAssetsResponse(null, "An error occured");
      }
    })
    .catch((res) => {
      if(res?.response?.data) {
        handleGetAssetsResponse(null, res?.response?.data.message);
        return;
      }
      handleGetAssetsResponse(null, res.message);
    })
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleGetAssets();
    })
    return unsubscribe;
  }, [])
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#f3f3f3"
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgContainer}>
          <Image source={require("../../assets/images/profile.png")} style={{ borderRadius: 50, height: 100, width: 100, marginTop: 30 }}/>
          <Text style={styles.username}>{user?.username}</Text>
          <View style={styles.subContainer}>
            <Feather name="mail" color="#fff" size={15} />
            <Text style={styles.subText}>{user?.email}</Text>
          </View>
          <View style={styles.subContainer}>
            <Feather name="phone" color="#fff" size={15} />
            <Text style={styles.subText}>{user?.phone}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AntDesign name="logout" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay}>
        </View>
        <View style={{ padding: 15, paddingTop: 0 }}>
            <View style={[styles.categoryContainer, {marginTop: 0}]}> 
                <Text style={styles.categoryHead}>Organization</Text>
                <Text style={styles.categoryBody}>{user?.organization}</Text>
            </View>
            <View style={styles.categoryContainer}> 
                <Text style={styles.categoryHead}>Team</Text>
                <Text style={styles.categoryBody}>{user?.team}</Text>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryHead}>Team Lead:</Text>
                <Text style={styles.categoryBody}>{user?.teamLead}</Text>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryHead}>Role</Text>
                <Text style={styles.categoryBody}>{user?.position}</Text>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryHead}>No. of assets</Text>
                <Text style={styles.categoryBody}>{assets.length}</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  )
})
const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: "Nunito_600SemiBold",
        color: "#777"
    },
    heading: {
        fontSize: 35,
        fontFamily: "Nunito_700Bold",
        color: "#00597D"
    },
    categoryContainer: {
        marginTop: 10
    },  
    categoryHead: {
        fontSize: 18,
        fontFamily: "Nunito_700Bold",
        color: "#00597D"
    },
    categoryBody: {
        fontSize: 16,
        fontFamily: "Nunito_500Medium",
        color: "#555",
        backgroundColor: "#e7e7e7be",
        padding: 12,
        borderRadius: 8,
        marginTop: 4
    },
    overlay: {
        position: "absolute",
        backgroundColor: "#f3f3f3",
        height: 30,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        top: 240,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    imgContainer: {
      height: 270,
      backgroundColor: "#00435e",
      alignItems: "center",
    },
    username: {
      fontSize: 30,
      color: "#fff",
      fontFamily: "Nunito_700Bold",
      marginTop: 10
    },
    logoutButton: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      width: 50,
      borderRadius: 25,
      right: 15,
      top: 15
    },
    subContainer: {
      flexDirection: "row",
      marginVertical: 4,
      columnGap: 7,
      alignItems: "center"
    },
    subText: {
      color: "#fff",
      fontFamily: "Nunito_600SemiBold",
    }
})

export default Profile