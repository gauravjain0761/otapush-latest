import messaging from "@react-native-firebase/messaging";
import { Alert, PermissionsAndroid, Platform } from "react-native";

import { getUniqueId } from "react-native-device-info";

export async function requestNotificationUserPermission() {
  if (Platform.OS === "android") {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    if (authStatus === 1) {
      if (Platform.OS === "ios") {
        await messaging()
          .registerDeviceForRemoteMessages()
          .then(async () => {
            getFirebaseToken();
          })
          .catch(() => {
            getFirebaseToken();
          });
      } else {
        getFirebaseToken();
      }
    } else {
      await messaging().requestPermission();
    }
  } else {
    await messaging().requestPermission();
  }
}

const getFirebaseToken = async () => {
  let uniqueId = await getUniqueId();
  await messaging()
    .getToken()
    .then((fcmToken) => {
      if (fcmToken) {
        console.log("---fcmToken---", fcmToken);
        // infoToast(fcmToken.toString());
      }
    })
    .catch((error) => {
      let err = `FCm token get error${error}`;
      console.log(err);
    });
};
