import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Dimensions, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { screenName } from "./screensName";
import { navigationRef } from "../navigations/MainNavigator";
import { CommonActions } from "@react-navigation/routers";

export const screen_width: number = Dimensions.get("window").width;
export const screen_height: number = Dimensions.get("window").height;

export const wp = (val: number) => {
  return widthPercentageToDP((val * 100) / screen_width);
};

export const hp = (val: number) => {
  return heightPercentageToDP((val * 100) / screen_height);
};

export const fontSize = (val: number) => RFValue(val, screen_height);

export const getText = (text: string) => {
  return text;
};

export const isIos = Platform.OS === "ios";

export const hitSlop = {
  top: hp(10),
  bottom: hp(10),
  left: wp(10),
  right: wp(10),
};

export const TabText = (text: string) => {
  switch (text) {
    case screenName.homeScreen:
      return "Home";
    case screenName.menuScreen:
      return "Menu";
    case screenName.settingScreen:
      return "Setting";
    case screenName.profileScreen:
      return "Profile";

    default:
      return "";
  }
};

export const dispatchNavigation = (name: string) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name }],
    })
  );
};
