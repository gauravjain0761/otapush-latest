import React from "react";
import { colors } from "../../theme/colors";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type Props = {};

const Loader = ({ visible = false }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
