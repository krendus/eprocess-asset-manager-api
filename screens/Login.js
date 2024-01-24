import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '../components/Input'
import { ToastAndroid } from 'react-native'
import { observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'react-native-paper'
import { loginRequest } from '../api/auth'
import { useStatusStore } from '../store/status.store'
import { useUserStore } from '../store/user.store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = observer(({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setStatus } = useStatusStore();
  const { addUser } = useUserStore();

  const handleSignInResponse = (data, err) => {
    setLoading(false);
    if(data) {
        AsyncStorage.setItem("token", data.token, () => {
          setStatus(true);
          addUser(data.user);
        })
    } else {
      if(Platform.OS === "android") {
        ToastAndroid.show(err, ToastAndroid.SHORT)
      } else {    
          Alert.alert(err, err)
      }
        console.log(err);
    }
  }

  const handleSignIn = () => {
    if(loading) return;
    setLoading(true);
    if (username && password) {
        loginRequest({
          username: username.trim(),
          password
          })
        .then((res) => {
          if(res.data.status === "success") {
            handleSignInResponse(res.data.data, res.data.message);
          } else {
            handleSignInResponse(null, "An error occured");
          }
        })
        .catch((res) => {
          console.log(res)
         
          if(res?.response?.data) {
            console.log(res?.response?.data)
            handleSignInResponse(null, res?.response?.data.message);
            return;
          }
          handleSignInResponse(null, res.message);
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
  useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setLoading(false)
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
        backgroundColor: "#fff"
      }}
    >
      <View style={styles.container}>
        <View style={{ flex: 5 }}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.subHeader}>Sign in to eProcess Assets Manager</Text>
          </View>
          <View style={styles.inputContainer}>
            <Input
              value={username}
              setValue={setUsername}
              label={"Username"}
              placeholder="Enter your username"
            />
            <Input
              value={password}
              setValue={setPassword}
              label={"Password"}
              placeholder="Enter your password"
              isPassword={true}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 5, marginBottom: 5 }}>  
            <Text style={styles.notify} on>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.notifyLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
            {loading ? <ActivityIndicator animating={true} color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 10
  },
  header: {
    fontSize: 40,
    fontFamily: "Nunito_700Bold",
    color: "#00597D"
  },
  subHeader: {
    fontSize: 16,
    color: "#00000088",
    fontFamily: "Nunito_500Medium",
  },
  inputContainer: {
    marginTop: 25,
  },
  btnContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  notify: {
    fontSize: 16,
    fontFamily: "Nunito_500Medium",
    textAlign: "center"
  },
  notifyLink: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#00435e"
  },
  btn: {
    backgroundColor: "#00435e",
    borderRadius: 15,
    display: 'flex',
    alignSelf: "stretch",
    marginTop: 10,
    padding: 17,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_700Bold"
  }
})

export default Login