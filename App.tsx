/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StatusBar, StyleSheet, View} from 'react-native';

import MainNavigator from './src/navigations/MainNavigator';
import {colors} from './src/theme/colors';
import {Provider, useDispatch} from 'react-redux';
import store from './src/redux';
import {ToastMessage} from './src/components';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {userLogin} from './src/actions/authAction';
import ForegroundHandler from './src/helper/ForgroundHelper';
import { requestNotificationUserPermission } from './src/helper/firebaseConfig';
// you can used this version of carousel
// "react-native-snap-carousel": "4.0.0-beta.6",

const App = () => {
  const [token, setToken] = useState('');
  const [deviceId, setDeviceId] = useState('');

  
  useEffect(() => {
    requestNotificationUserPermission();
    getDeviceInfo();
    pushNotification();
    // for foreground State
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification recieve in foreground state', remoteMessage);
      ForegroundHandler(remoteMessage, 'Foreground');
    });

    
  
    // for background and kill state
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Notification recieve in background state!', remoteMessage);
    });

    // for clicking msg and opening app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notifcation pressed in background',
        remoteMessage.notification,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification pressed in kill state',
            remoteMessage.notification,
          );
        }
      });

    return unsubscribe;
  }, []);

  async function getDeviceInfo() {
    DeviceInfo.getUniqueId().then(uniqueId => {
      console.log('deviceId', uniqueId);
      setDeviceId(uniqueId);
    });
  }

  async function pushNotification() {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('token', fcmToken);
      setToken(fcmToken);
    }
  }

  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={colors.primary} barStyle={'dark-content'} />
        <MainNavigator />
        <ToastMessage />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
