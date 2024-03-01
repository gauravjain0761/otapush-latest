import React, {FC} from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {screenName} from '../helper/screensName';

import HomeScreen from '../screens/home/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ConfigScreen from '../screens/ConfigScreen';

export type RootStackParamList = {
  Login: undefined;
  LoginOption: undefined;
  WebViewScreen: {title: string; end_point: string};
};

const options: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_bottom',
  animationDuration: 500,
  gestureEnabled: true,
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator: FC = () => {
  return (
    <Stack.Navigator
      // @ts-ignore
      initialRouteName={screenName.homeScreen}
      screenOptions={options}>
      <Stack.Screen
        // @ts-ignore
        name={screenName.homeScreen}
        component={HomeScreen}
      />
      <Stack.Screen
        // @ts-ignore
        name={screenName.notification}
        component={NotificationScreen}
      />
      <Stack.Screen
        // @ts-ignore
        name={screenName.configScreen}
        component={ConfigScreen}
      />
    </Stack.Navigator>
  );
};
export default StackNavigator;
