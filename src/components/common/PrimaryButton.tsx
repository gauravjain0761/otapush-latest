import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { hp, wp } from "../../helper/globalFunctions";
import { colors } from "../../theme/colors";
import {
  appCommonStyles,
  commonFontStyle,
  fontFamily,
} from "../../theme/commonStyle";
import { useAppSelector } from "../../redux/hooks";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const PrimaryButton = ({ title, onPress, disabled }: ButtonProps) => {
  const { isButtonLoading } = useAppSelector((state) => state.common);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ ...styles.container, opacity: disabled ? 0.6 : 1 }}
    >
      {isButtonLoading ? (
        <ActivityIndicator size={"small"} color={colors.white} />
      ) : (
        <Text style={styles.textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(55),
    alignItems: "center",
    marginBottom: hp(20),
    borderRadius: wp(10),
    justifyContent: "center",
    marginHorizontal: wp(25),
    backgroundColor: colors.primary,
    ...appCommonStyles.shadowContainer,
  },
  textStyle: {
    ...commonFontStyle(fontFamily.semiBold, 16, colors.white),
  },
});

export default PrimaryButton;
