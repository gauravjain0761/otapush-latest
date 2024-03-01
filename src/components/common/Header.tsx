import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { hitSlop, wp } from "../../helper/globalFunctions";
import { Icons } from "../../theme/icons";
import { useNavigation } from "@react-navigation/native";
import { commonFontStyle, fontFamily } from "../../theme/commonStyle";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const { goBack } = useNavigation();
  const onPressGoBack = () => goBack();
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.innerContainer}>
          <TouchableOpacity hitSlop={hitSlop} onPress={onPressGoBack}>
            <Image
              resizeMode="contain"
              source={Icons.ic_back}
              style={styles.backIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.titleTextStyle}>{title}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 7,
  },
  innerContainer: {
    padding: wp(18),
    flexDirection: "row",
    alignItems: "center",
  },
  dropShadowStyle: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  backIconStyle: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(20),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
    flex: 1,
  },
});

export default Header;
