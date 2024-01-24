import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Folder = () => {
    const insets = useSafeAreaInsets();
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
      <Text style={{ fontSize: 20, color: "#444", marginTop: 90, textAlign: "center", fontFamily: "Nunito_600SemiBold" }}>Folder coming soon!!!</Text>
    </View>
  )
}

export default Folder