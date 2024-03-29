import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, BackHandler, Image, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Camera } from 'expo-camera';
import DatePicker from '../../components/DatePicker';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useUserStore } from '../../store/user.store';
import { createAssetRequest } from '../../api/assets';
import { uploadToCloudinary } from '../../utils/utils';

const AddAsset = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [accessories, setAccessories] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [asset, setAsset] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const {user} = useUserStore();
  const [ratio, setRatio] = useState("4:3");
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
  const handleCreateAssetResponse = (data, message) => {
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
          Alert.alert("Error", message);
      }
    }
  }
  const getRatioStyling = () => {
    if(Platform.OS === "android") {
      const parts = ratio.split(":");
      const realRatio = Number(parts[0])/Number(parts[1]);
      const gap = Math.floor((height - realRatio * width)/2);
      return {
        marginVertical: gap
      }
    } else {
      return {};
    }
  }
  const handleCreateAsset = async () => {
    if(loading) return;
    setLoading(true);
    if ( accessories && serialNumber && asset && capturedImg && date ) {
        setImageUploading(true);
        const uploadedImage = await uploadToCloudinary("samuraidev", capturedImg.uri, "asset", "839935435497676", "zjuuiycx", setUploadProgress)
        const item = {
          name: asset.trim(),
          receivedDate: date,
          serialNumber: serialNumber.trim(),
          imageURL: uploadedImage.secure_url,
          accessories: accessories.trim(),
        }
        createAssetRequest(item).then((res) => {
          console.log(res.data)
          if(res.data.status === "success") {
            handleCreateAssetResponse(res.data.data, res.data.message);
          } else {
            handleCreateAssetResponse(null, "An error occured");
          }
        })
        .catch((res) => {
          if(res?.response?.data) {
            handleCreateAssetResponse(null, res?.response?.data.message);
            return;
          }
          handleCreateAssetResponse(null, res.message);
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
            <TouchableOpacity style={styles.closeBtn} onPress={() => setStartCamera(false)}>
              <AntDesign name="close" size={35} color={"#fff"} />
            </TouchableOpacity>
          </Camera>
        ) : (
          <View style={{ padding: 15 }}>
            <>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign size={25} color={"#00435e"}name="arrowleft"/>
              </TouchableOpacity>
              <Text style={styles.heading}>Add Asset</Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 70 }}
            >
              <Dropdown
                setValue={setAsset}
                label={"Asset"}
                placeholder="Select Asset"
                data={[
                  {
                    key: 1,
                    value: "Laptop"
                  },
                  {
                    key: 2,
                    value: "Iphone"
                  },
                  {
                    key: 2,
                    value: "Monitor"
                  }
                ]}
              />
              <Input
                value={accessories}
                setValue={setAccessories}
                label={"Accessories"}
                placeholder="Enter your accessories..."
              />
              <Input
                value={serialNumber}
                setValue={setSerialNumber}
                label={"Serial Number"}
                placeholder="Enter Asset Serial Number"
              />
              <DatePicker 
                label={"Received date"}
                date={date}
                setDate={setDate}
              />
              <View style={[styles.imageContainer, {height: capturedImg ? 200 : 95, position: "relative"}]}>
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
              <TouchableOpacity style={styles.btn} onPress={handleCreateAsset}>
                {loading ? <ActivityIndicator animating={true} color="#fff" /> : <Text style={styles.btnText}>Submit</Text>}
              </TouchableOpacity>
            </ScrollView>
            </>
        </View>
      )}
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
  closeBtn: {
    position: "absolute",
    right: 20,
    top: 20
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

export default AddAsset