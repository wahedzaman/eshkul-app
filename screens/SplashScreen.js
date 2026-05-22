import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import SplashService from '../services/SplashService';
import Colors from '../constants/Colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const initApp = async () => {
      const hasSession = await SplashService.checkSession();
      // Keep splash active for at least 1.5 seconds to preserve aesthetic pacing
      setTimeout(() => {
        if (hasSession) {
          navigation.replace('AppContainer');
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    };

    initApp();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color={Colors.primary || '#0f5279'}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
