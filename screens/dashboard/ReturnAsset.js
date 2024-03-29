import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, BackHandler, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input from '../../components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Camera } from 'expo-camera';
import DatePicker from '../../components/DatePicker';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { returnAssetRequest } from '../../api/assets';
import { uploadToCloudinary } from '../../utils/utils';

const ReturnAsset = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [startCamera, setStartCamera] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const [date, setDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { id } = route.params;
  const [loading, setLoading] = useState(false);
  const { height, width } = Dimensions.get("window");
  const [camera, setCamera] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const initCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access Denied")
    }
  }
  const captureImg = async () => {
    if(!camera) return;
    try { 
      const picture = await camera.takePictureAsync();
      setCapturedImg(picture);
      setStartCamera(false);
      setPreviewAvailable(true);
    } catch(e) {
      console.log(e)
    }
  }
  const getRatioStyling = () => {
    if(Platform.OS === "android") {
      const parts = "4:3".split(":");
      const realRatio = Number(parts[0])/Number(parts[1]);
      const gap = Math.floor((height - realRatio * width)/2);
      return {
        marginVertical: gap
      }
    } else {
      return {};
    }
  }
  const handleReturnAssetResponse = (data, message) => {
    setLoading(false);
    if(data) {
        if(Platform.OS === "android") {
          ToastAndroid.show(message, ToastAndroid.SHORT)
        }
        navigation.navigate("Dashboard", {
          screen: "Home"
        })
    } else {
      if(Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT)
      } else {    
          Alert.alert("error", message);
      }
        console.log(err);
    }
  }
  const handleReturnAsset = async () => {
    if(loading) return;
    setLoading(true);
    if (reason && capturedImg && date) {
      setImageUploading(true);
      setShowModal(false);
      const uploadedImage = await uploadToCloudinary("samuraidev", capturedImg.uri, "asset", "839935435497676", "zjuuiycx", setUploadProgress)
      const item = {
        returnDate: date,
        returnReason: reason,
        returnImageURL: uploadedImage.secure_url,
        id,
      }
      returnAssetRequest(item).then((res) => {
        console.log(res.data)
        if(res.data.status === "success") {
          handleReturnAssetResponse(res.data.data, res.data.message);
        } else {
          handleReturnAssetResponse(null, "An error occured");
        }
      })
      .catch((res) => {
        if(res?.response?.data) {
          console.log(res?.response?.data)
          handleReturnAssetResponse(null, res?.response?.data.message);
          return;
        }
        handleReturnAssetResponse(null, res.message);
      })
    } else {
        setLoading(false);
        if(Platform.OS === "android") {
            ToastAndroid.show("Please enter required fields", ToastAndroid.SHORT)
        } else {    
            Alert.alert("Required fields", "Please enter required fields");
        }
    }
  }
  
  return (
    <View 
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: startCamera ? "#00435e" : "#f3f3f3",
      }}
    >
      {
        startCamera ? (
          <Camera 
            style={{
              flex: 1,
              width:"100%",
              alignItems: "center",
              ...getRatioStyling()
            }}
            ref={(r) => {
              setCamera(r);
            }}
            ratio={"4:3"}
          >
            <TouchableOpacity style={styles.captureBtn} onPress={captureImg}>
              <EvilIcons name="camera" size={35} color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtnC} onPress={() => setStartCamera(false)}>
              <AntDesign name="close" size={35} color={"#fff"} />
            </TouchableOpacity>
          </Camera>
        ) :
        (<View style={{ padding: 15 }}>
          <>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign size={25} color={"#00435e"}name="arrowleft"/>
              </TouchableOpacity>
              <Text style={styles.heading}>Return Asset</Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 70 }}
            >
              <Input
                value={reason}
                setValue={setReason}
                label={"Reason for return"}
                placeholder="Enter your reason..."
              />
              <DatePicker 
                label={"Return date"}
                date={date}
                setDate={setDate}
              />
              <View style={[styles.imageContainer, {height: capturedImg ? 200 : 95}]}>
                {
                  previewAvailable ? (
                    <Image source={{ uri:  capturedImg.uri }} style={{ height: 200, width: 200 }} />
                  ):( 
                    <Text style={styles.placeholder}>No image captured</Text>
                  )
                }
                {
                  !imageUploading && (
                    <TouchableOpacity style={styles.uploadBtn} onPress={initCamera}>
                      <EvilIcons name="camera" size={28} color={"#fff"} />
                    </TouchableOpacity>
                  )
                }
                {
                  imageUploading && (
                    <View style={styles.progressModal}>
                      <Text style={{ fontSize: 20, fontFamily: "Nunito_700Bold", color: "white", marginBottom: 10 }}>{Math.ceil(uploadProgress)} %</Text>
                      <View style={{ height: 5, width: "60%", backgroundColor: "#fff", borderRadius: 99 }}>
                        <View style={{ height: "100%", width: `${uploadProgress}%`, backgroundColor: "#00b3faff", borderRadius: 99 }}></View>
                      </View>
                    </View>
                  )
                }
              </View>
              <TouchableOpacity style={styles.btn} onPress={() => setShowModal(true)}>
                {loading ? <ActivityIndicator animating={true} color="#fff" /> : <Text style={styles.btnText}>Return</Text>}
              </TouchableOpacity>
            </ScrollView>
          </>
          {
            showModal && (
              <View style={[StyleSheet.absoluteFill, { width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, backgroundColor: "#00000040", alignItems: "center", justifyContent: "center" }]}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalText}>Are you sure you want to return this asset ?</Text>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                      <Text style={styles.btnTextW}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.proceedBtn} onPress={handleReturnAsset}>
                      {loading ? <ActivityIndicator animating={true} color="#fff" /> :<Text style={styles.btnText}>Proceed</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }
        </View>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    fontFamily: "Nunito_600SemiBold",
    color: "#00435e",
    marginVertical: 20
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00435e",
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 25,
    paddingBottom: 15,
    justifyContent: "center",
    columnGap: 5,
  },
  placeholder: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  btn: {
    backgroundColor: "#00435e",
    borderRadius: 15,
    display: 'flex',
    alignSelf: "stretch",
    marginTop: 20,
    padding: 17,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_700Bold"
  },
  btnTextW: {
    color: "#00435e",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_700Bold"
  },
  captureBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00435e",
    width: 80,
    height: 80,
    position: "absolute",
    paddingBottom: 10,
    borderRadius: 40,
    bottom: 20,
  },
  closeBtnC: {
    position: "absolute",
    right: 20,
    top: 20
  },
  modalCard: {
    backgroundColor: "#fff",
    height: 150,
    justifyContent: "center",
    width: "80%",
    borderRadius: 15,
    padding: 25,
  },
  modalText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold"
  },
  closeBtn: {
    backgroundColor: "transparent",
    borderRadius: 15,
    display: 'flex',
    alignSelf: "stretch",
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    height: 40,
    borderColor: "#00435e",
    width: 110,
  },
  proceedBtn: {
    backgroundColor: "#00435e",
    borderRadius: 15,
    display: 'flex',
    alignSelf: "stretch",
    marginTop: 20,
    width: 110,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#00435e",
  },
  progressModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)"
  }
})

export default ReturnAsset