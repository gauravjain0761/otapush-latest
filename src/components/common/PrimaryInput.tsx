import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { hp, wp } from "../../helper/globalFunctions";
import { colors } from "../../theme/colors";
import { Icons } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/commonStyle";

type PrimaryInputProps = {
  value: string;
  icon: any;
  placeholder: string;
  onChangeText: (e: string) => void;
};

const PrimaryInput = ({
  onChangeText,
  value,
  icon,
  placeholder,
}: PrimaryInputProps) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View
      style={{
        ...styles.container,
        borderColor: isFocus ? colors.primary : colors.grey_2,
      }}
    >
      <Image
        resizeMode="contain"
        source={icon}
        style={{
          ...styles.iconStyle,
          tintColor: isFocus ? colors.primary : colors.shadow,
        }}
      />
      <TextInput
        value={value}
        style={styles.inputStyle}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        placeholderTextColor={colors.grey_3}
        autoCapitalize={"none"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(60),
    borderWidth: 2,
    marginTop: hp(20),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(10),
    marginHorizontal: wp(25),
    paddingHorizontal: wp(20),
    borderColor: colors.grey_2,
    backgroundColor: colors.grey_2,
  },
  iconStyle: {
    height: wp(22),
    width: wp(22),
    tintColor: colors.shadow,
  },
  inputStyle: {
    flex: 1,
    margin: 0,
    padding: 0,
    height: hp(58),
    marginLeft: wp(20),
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
});

export default PrimaryInput;
