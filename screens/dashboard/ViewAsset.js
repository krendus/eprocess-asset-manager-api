import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ToastAndroid, Alert, Dimensions, RefreshControl, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../store/user.store';
import { ActivityIndicator } from 'react-native-paper';

const ViewAsset = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useUserStore();
  const { id } = route.params;
  const handleGetAssetResponse = (data, err) => {
    setLoading(false);
    setRefreshing(false);
    if(data) {
        console.log("Asset Fetched");
        setAsset(data);
        console.log(asset);
    } else {
      if(Platform.OS === "android") {
        ToastAndroid.show("Error fetching asset", ToastAndroid.SHORT)
      } else {    
          Alert.alert("Error fetching asset", "Error fetching asset");
      }
        console.log(err);
    }
  }
  const handleGetSingleAsset = () => {
    // getSingleAsset(id, handleGetAssetResponse);
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetSingleAsset();
  })
  useEffect(() => {
    if(id) { 
      const unsubscribe = navigation.addListener("focus", () => {
        handleGetSingleAsset();
      })
      return unsubscribe;
    }
  }, [id])
  
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
      {
        !loading ? (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  progressViewOffset={40}
                  colors={["#00597D"]}
                  tintColor={"#00435e"}
                  onRefresh={onRefresh}
                />
              }
            >
            {
              asset?.status === "Returned" ? (
                <View>
                  <View style={styles.imageGrid}>
                    <Image source={{ uri: asset?.image }}  style={{ height: 300, width: Dimensions.get("window").width / 2 - 1 }} />
                    <View style={{ width: 2, backgroundColor: "#fff"}}></View>
                    <Image source={{ uri: asset?.return_image }} style={{ height: 300, width:  Dimensions.get("window").width / 2 - 1 }} />
                  </View>
                  <View style={styles.cover}></View>
                  <View style={styles.tagLeft}>
                    <EvilIcons name="image" size={14} color={"#00597D"}/>
                    <Text style={styles.tagText}>Previous</Text>
                  </View>
                  <View style={styles.tagRight}>
                    <EvilIcons name="image" size={14} color={"#00597D"}/>
                    <Text style={styles.tagText}>Current</Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Image source={{ uri: asset?.status === "Returned" ? asset?.return_image : asset?.image }} style={{ height: 300, width: "100%" }} />
                  <View style={styles.cover}></View>
                  <View style={styles.tagLeft}>
                    <EvilIcons name="image" size={14} color={"#00597D"}/>
                    <Text style={styles.tagText}>Current</Text>
                  </View>
                </View>
              )
            }
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <AntDesign size={25} color={"#fff"}name="arrowleft"/>
            </TouchableOpacity>
            <LinearGradient colors={["transparent", "#f3f3f3ab", "#f3f3f3"]} style={styles.overlay}>
                <Text style={styles.heading}>{asset?.name}</Text>
                <Text style={styles.label}>{asset?.serial_number}</Text>
            </LinearGradient>
            <View style={{ padding: 15 }}>
                <View style={styles.categoryContainer}> 
                    <Text style={styles.categoryHead}>Team</Text>
                    <Text style={styles.categoryBody}>{user?.team}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryHead}>Team Lead:</Text>
                    <Text style={styles.categoryBody}>{user?.teamLead}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryHead}>Accessories:</Text>
                    <Text style={styles.categoryBody}>{asset?.accessories}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryHead}>Received Date:</Text>
                    <Text style={styles.categoryBody}>{asset?.received_date}</Text>
                </View>
                {
                  asset?.status === "Returned" && (
                    <>
                      <View style={styles.categoryContainer}>
                          <Text style={styles.categoryHead}>Reason for return:</Text>
                          <Text style={styles.categoryBody}>{asset?.return_reason}</Text>
                      </View>
                      <View style={styles.categoryContainer}>
                          <Text style={styles.categoryHead}>Return Date:</Text>
                          <Text style={styles.categoryBody}>{asset?.return_date}</Text>
                      </View>
                    </>
                  )
                }
                {
                  asset?.status === "In possession" && (
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ReturnAsset", {
                      id
                    })}>
                      <Text style={styles.btnText}>Return Asset</Text>
                    </TouchableOpacity>
                  )
                }
            </View>
        </ScrollView>
        ) : (
          <View style={{ marginTop: 200 }}>
            <ActivityIndicator animating={true} color="#00435e" size={"large"} />
          </View>
        )
      }
    </View>
  )
}
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
        marginTop: 10,
        paddingBottom: 12,
        marginHorizontal: 10
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
    back: {
        position: "absolute",
        left: 15,
        top: 15,
    },
    overlay: {
        position: "absolute",
        backgroundColor: "#ffffff52",
        height: 70,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        top: 230,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    cover: {
      height: 300,
      width: "100%",
      backgroundColor: "#00000055",
      position: "absolute",
      top: 0,
      left: 0,
    },
    btn: {
      backgroundColor: "#00435e",
      borderRadius: 15,
      display: 'flex',
      alignSelf: "stretch",
      marginTop: 30,
      padding: 17,
    },
    btnText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Nunito_700Bold"
    },
    imageGrid: {
      flexDirection: "row",
      position: 'relative',
    },
    blur: {
      width: 15,
      height: 300,
      position: "absolute",
      top: 0,
      left: Dimensions.get("window").width / 2 - 15,
    },
    blurRight: {
      width: 15,
      height: 300,
      position: "absolute",
      top: 0,
      left: Dimensions.get("window").width / 2,
    },
    tagLeft: {
      position: "absolute",
      top: 190,
      left: 20,
      flexDirection: "row",
      alignItems: "center",
      columnGap: 3,
      height: 22,
      paddingHorizontal: 10,
      borderRadius: 40,
      zIndex: 9,
      backgroundColor: "#f3f3f3"
    },
    tagRight: {
      position: "absolute",
      top: 190,
      left: 20 + Dimensions.get("window").width / 2,
      flexDirection: "row",
      alignItems: "center",
      columnGap: 3,
      height: 22,
      paddingHorizontal: 10,
      borderRadius: 40,
      zIndex: 9,
      backgroundColor: "#f3f3f3"
    },
    tagText: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: 11,
      color: "#00597D"
    }
})

export default ViewAsset