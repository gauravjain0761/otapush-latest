//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {
  hp,
  screen_height,
  screen_width,
  wp,
} from '../../helper/globalFunctions';
import {Icons} from '../../theme/icons';
import {colors} from '../../theme/colors';
import {fontFamily, commonFontStyle} from '../../theme/commonStyle';
import {PrimaryButton} from '..';
import {useDispatch} from 'react-redux';
import {onSubscribeQR} from '../../actions/authAction';
import {useAppSelector} from '../../redux/hooks';
import firestore from '@react-native-firebase/firestore';
import {navigationRef} from '../../navigations/MainNavigator';
import { PERMISSIONS } from 'react-native-permissions';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  itemData: any;
};

// create a component
const QRCodeModal = ({isVisible, onClose, itemData}: Props) => {
  const [sucessModal, setSucessModal] = useState(false);
  const {deviceCode} = useAppSelector(state => state.common);
  const [textValue, setTextValue] = useState('');
  const dispatch = useDispatch<any>();

  const onSuccess = e => {
   

    const originalURL = e.data;
    const modifiedURL = originalURL.replace(/^https?:\/\//, '');
    setTextValue(modifiedURL);
  };

  const onSubmitPress =async() => {
    let fcmToken = await messaging().getToken();
    if (textValue.trim().length == 0) {
      Alert.alert('Please enter subscribe id');
    } else {
      const obj = {
        data: {
          ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
          SP: 'SN_API_NotiSubscribe',
          ParameterValues: [
            ['DeviceCode', deviceCode],
            ['Qrcode', textValue],
          ],
        },
        onSuccess: async (res: any) => {
          const firestoreDocument = await firestore()
            .collection('Users')
            .doc(deviceCode)
            .get();
          const updatedUser = firestoreDocument.data();
          const term = {
            key: res?.Results[0][0],
            config: res?.Results[1],
            enable:true,
            token:fcmToken
          };
          if (updatedUser?.list == undefined) {
            firestore()
              .collection('Users')
              .doc(deviceCode)
              .set({list: [term]})
              .then(async res => {
                onClose();
                setTextValue('');
              });
          } else {
            const updateDataList = [...updatedUser?.list];
            console.log('updatedUser?.list', updatedUser?.list.length);
            updateDataList.push(term);
            firestore()
              .collection('Users')
              .doc(deviceCode)
              .update({list: updateDataList})
              .then(async res => {
                onClose();
                setTextValue('');
              });
          }
        },
        onFailure: () => {
          Alert.alert('You already subscribe this service.', '', [
            {
              text: 'Ok',
              onPress: () => {
                onClose();
                setTextValue('');
              },
            },
          ]);
        },
      };
      dispatch(onSubscribeQR(obj));
    }
  };

  return (
    <Modal
      animationInTiming={500}
      animationOutTiming={500}
      style={{margin: 0, flex: 1}}
      backdropOpacity={0.2}
      isVisible={isVisible}
      onBackButtonPress={() => {
        onClose();
        setTextValue('');
      }}
      onBackdropPress={() => {
        onClose();
        setTextValue('');
      }}>
      <View style={styles.container}>
        <View style={styles.bodyContent}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              setTextValue('');
            }}
            style={{alignSelf: 'flex-end'}}>
            <Image source={Icons.ic_close} style={styles.qrCodeIcon} />
          </TouchableOpacity>
          <View style={{marginTop: hp(20), height: wp(220)}}>
            <Text style={styles.scanQrStyle}>Scan QR code</Text>
            <QRCodeScanner
              onRead={onSuccess}
              flashMode={RNCamera.Constants.FlashMode.off}
              cameraStyle={{
                width: wp(190),
                height: wp(190),
                alignSelf: 'center',
                borderWidth: 1,
                overflow: 'hidden',
                borderRadius: 10,
              }}
            />
          </View>
          <TextInput
            value={textValue}
            onChangeText={text => setTextValue(text)}
            style={styles.inputStyle}
            placeholder="or Enter Code"
          />
          <PrimaryButton title="Submit" onPress={onSubmitPress} />
          <View style={{height: 50}} />
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  bodyContent: {
    width: screen_width * 0.9,
    backgroundColor: colors.white,
    borderRadius: 24,
    height: screen_height * 0.6,
  },

  qrCodeIcon: {
    width: wp(20),
    height: wp(20),
    marginTop: 15,
    alignItems: 'flex-end',
    marginRight: wp(20),
  },
  inputStyle: {
    borderWidth: 1,
    marginHorizontal: wp(24),
    marginTop: hp(20),
    paddingLeft: wp(10),
    borderRadius: 10,
    borderColor: colors.grey,
    marginBottom: hp(20),
    paddingVertical:Platform.OS == 'ios' ?10:0,
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  scanQrStyle: {
    marginHorizontal: wp(24),
    marginBottom: 10,
    textAlign: 'center',
    ...commonFontStyle(fontFamily.regular, 20, colors.black),
  },
});

//make this component available to the app
export default QRCodeModal;
