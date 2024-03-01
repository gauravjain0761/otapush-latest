//import liraries
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Toast from "react-native-toast-message";
import DropShadow from "react-native-drop-shadow";
import { colors } from "../../theme/colors";
import { commonFontStyle, fontFamily } from "../../theme/commonStyle";
import { hp, screen_width, wp } from "../../helper/globalFunctions";

const ToastMessage = React.forwardRef((props, ref) => {
  const toastConfig = {
    success: ({ text1, text2, type, props, ...rest }: any) =>
      type === "success" && (
        <DropShadow style={styles.dropShadowSuccessStyle}>
          <View
            style={{
              ...styles.toastStyle,
              backgroundColor: colors.white,
            }}
          >
            <Text
              style={{
                ...styles.textStyleToast,
                color: colors.black,
              }}
            >
              {text1?.toString()}
            </Text>
          </View>
        </DropShadow>
      ),
    error: ({ text1, text2, type, props, ...rest }: any) =>
      type === "error" && (
        <DropShadow style={styles.dropShadowErrorStyle}>
          <View style={styles.toastStyle}>
            <Text style={{ ...styles.textStyleToast, color: colors.red_500 }}>
              {text1?.toString()}
            </Text>
          </View>
        </DropShadow>
      ),
    info: ({ text1, text2, type, props, ...rest }: any) =>
      type === "info" && (
        <DropShadow style={styles.dropShadowInfoStyle}>
          <View
            style={{
              ...styles.toastStyle,
              backgroundColor: colors.white,
            }}
          >
            <Text
              style={{
                ...styles.textStyleToast,
                color: colors.black,
              }}
            >
              {text1?.toString()}
            </Text>
          </View>
        </DropShadow>
      ),
  };
  return (
    <Toast
      {...props}
      position={"bottom"}
      bottomOffset={hp(100)}
      config={toastConfig}
      visibilityTime={2000}
      // @ts-ignore
      ref={(ref: any) => Toast.setRef(ref)}
    />
  );
});

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: colors.white,
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    maxWidth: screen_width - wp(40),
    borderRadius: wp(20),
    flexDirection: "row",
    flex: 1,
  },
  textStyleToast: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
    textAlign: "center",
  },
  dropShadowSuccessStyle: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  dropShadowErrorStyle: {
    shadowColor: colors.red_500,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  dropShadowInfoStyle: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  iconStyle: {
    height: wp(22),
    width: wp(22),
    marginRight: wp(10),
    marginLeft: wp(-10),
  },
});

export default ToastMessage;

export const infoToast = (message: string) => {
  Toast.show({ type: "info", text1: message });
};

export const errorToast = (message: string) => {
  Toast.show({ type: "error", text1: message });
};

export const successToast = (message: string) => {
  Toast.show({ type: "success", text1: message });
};
