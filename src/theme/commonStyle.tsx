import { colors } from "./colors";
import { StyleSheet, TextStyle } from "react-native";
import { fontSize } from "../helper/globalFunctions";

export const fontFamily = {
  // bold: "ReadexPro-Bold",
  light: "ReadexPro-Light",
  bold: "ReadexPro-SemiBold",
  medium: "ReadexPro-Medium",
  regular: "ReadexPro-Regular",
  semiBold: "ReadexPro-SemiBold",
  extraLight: "ReadexPro-ExtraLight",
};

export const appCommonStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  shadowContainer: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export function commonFontStyle(
  fontFamily: string,
  size: number,
  color: string
): TextStyle {
  return {
    fontFamily: fontFamily,
    fontSize: fontSize(size),
    color: color,
    includeFontPadding: false,
  };
}
