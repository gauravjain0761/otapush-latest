import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {fontFamily, commonFontStyle} from '../../theme/commonStyle';
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {hp, screen_height, wp} from '../../helper/globalFunctions';
import {Icons} from '../../theme/icons';
import {QRCodeModal} from '../../components';
import {FloatingAction} from 'react-native-floating-action';
import LottieView from 'lottie-react-native';
import {
  onDelectAction,
  onNotificationrespondsAction,
  userLogin,
} from '../../actions/authAction';
import DeviceInfo from 'react-native-device-info';
import messaging, { firebase } from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux/hooks';
import _ from 'lodash';
import {GET_DEVICE_LIST} from '../../actions/actionsTypes';
import {screenName} from '../../helper/screensName';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const {navigate} = useNavigation();
  const [qrModalShow, setQrModalShow] = useState(false);
  const [loging, setLoging] = useState(false);
  const dispatch = useDispatch<any>();
  const [token, setToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceCode, setDeviceCode] = useState('');
  const [selectBox, setSelectBox] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [configList, setConfigList] = useState([]);
  const [selectConfig, setSelectConfig] = useState(true);
  const {deviceList} = useAppSelector(state => state.common);
  const [isFirstShow, setIsFirstShow] = useState(true);
  const [isEnable, setIsEnable] = useState(true);
  const [selectDelete, setSelectDelete] = useState('');
  const isFocused = useIsFocused();

  const actions = [
    // {
    //   text: 'QR Scanner',
    //   icon: Icons.ic_qrcode,
    //   name: 'bt_accessibility',
    //   position: 2,
    // },
  ];

  useEffect(() => {
    getDeviceInfo();
  }, [isFocused]);

  useEffect(()=>{
   
   requestUserPermission()
   
  },[])

  const requestUserPermission = async () => {
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
              pushNotification();
            })
            .catch(() => {
              pushNotification();
            });
        } else {
          pushNotification();
        }
      } else {
        await messaging().requestPermission();
        pushNotification();
      }
    } else {
      await messaging().requestPermission();
      pushNotification();
    }
}


  async function getDeviceInfo() {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const firestoreDocument = await firestore()
        .collection('Users')
        .doc(deviceCode)
        .get();
      const updatedUser = firestoreDocument.data();
      const update = updatedUser?.list === undefined ? [] : updatedUser?.list;
      setDataList(update);
    };
    getUserInfo();
  }, [qrModalShow, isFocused, dataList?.length, token, deviceCode]);

  const onDelectPress = (item:any) => {
    Alert.alert('', 'Are you sure you want to delete ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onConfirmDelection(item)},
    ]);
  };

  const onConfirmDelection = (item:any) => {   
    setLoging(true);
    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Manage_Subscription',
        ParameterValues: [
          ['SubKey',item ],
          ['DeviceCode', deviceCode],
          ['Action', 'delete'],
          ['Config', ''],
        ],
      },
      onSuccess: (res: any) => {
        const filterData= dataList.filter((list)=>list?.key?.SubKey !== item)
        console.log('filterData',filterData);
        firestore()
          .collection('Users')
          .doc(deviceCode)
          .update({list: filterData})
          .then(async res => {
             setDataList(filterData)
          });
           setLoging(false);
      },
      onFailure: () => {
        setLoging(false);
      },
    };
    dispatch(onDelectAction(obj));
  };
  
  
  useEffect(() => {
    if (token) {
      let model = DeviceInfo.getModel();
      let readableVersion = DeviceInfo.getReadableVersion();
      if(deviceCode.trim().length == 0){        
        setLoging(true);
        const obj = {
          data: {
            ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
            SP: 'SN_API_REGISTER',
            ParameterValues: [
              ['token', token],
              ['device', deviceId],
              ['os', Platform.OS],
              ['version', readableVersion],
              ['model', model],
            ],
          },
          onSuccess: (res: any) => {
            const valueData = res?.Results?.[0];
            setLoging(false);
            console.log('adsddasda', valueData[0]['Device Code']);
            setDeviceCode(valueData[0]['Device Code']);
          },
          onFailure: () => {
            setLoging(false);
          },
        };
        dispatch(userLogin(obj));
      }
    }
  }, [token]);

  const   pushNotification =async()=> {
    // let fcmToken = await messaging().getToken();
    let fcmToken = await firebase.messaging().getToken();


    if (fcmToken) {
      console.log('token22', fcmToken);
      setToken(fcmToken);
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FAF9F9'}}>
      <View style={styles.row}>
        {/* <View /> */}
        <Text style={styles.orderStyle}>{isFirstShow ? 'OTAPUSH' : ''}</Text>
        {/* <View style={styles.rightView}></View> */}
      </View>
      {loging ? (
        <View style={styles.rowLoading}>
          <Text style={styles.loadingText}>
            {'Please wait we are\nfetching device information….'}
          </Text>
          <LottieView
            source={require('../../assets/Lottie/loding.json')}
            style={{
              width: '90%',
              height: '90%',
              position: 'absolute',
              top: screen_height * 0.1,
            }}
            autoPlay
            loop
          />
        </View>
      ) : (
        <>
          <Text style={styles.headerText}>
            {'Your Device Code is '}
            <Text style={styles.headerSubText}>{deviceCode}</Text>
          </Text>
          {dataList?.length == 0 && (
            <Text style={styles.headermainText}>
              Please add Subscription to Receive targeted Notifications
            </Text>
          )}

          <ScrollView style={{flex: 1}}>
            <View style={{marginTop: hp(10)}}>
              {dataList?.map((item: any, index: number) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      //@ts-ignore
                      navigate(screenName.notification, {
                        data: {
                          deviceCode: deviceCode,
                          SubKey: item?.key?.SubKey,
                          name:item?.key?.Name
                        },
                      })
                    }
                    style={styles.boxStyle}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={[styles.boxListText]}>{`SUBKEY :  ${
                          item?.key?.SubKey || '-'
                        }`}</Text>
                        <Text
                          style={[
                            styles.boxListText,
                            {marginTop: hp(10)},
                          ]}>{`NAME :  ${item?.key?.Name || '-'}`}</Text>
                      </View>
                      <View>
                       
                        <TouchableOpacity onPress={()=>onDelectPress(item?.key?.SubKey)}>
                          <Image
                            source={Icons.ic_delete}
                            style={[styles.deleteIcon]}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            //@ts-ignore
                            navigate(screenName.configScreen, {
                              data: {
                                deviceCode: deviceCode,
                                SubKey: item?.key?.SubKey,
                                list: item?.config,
                                index: index,
                                dataList: dataList,
                                enable: item?.enable,
                              },
                            })
                          }}>
                          <Image
                            source={Icons.ic_setting}
                            style={styles.notificationIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
      {isFirstShow ? (
        // <FloatingAction
        //   actions={actions}
        //   color={colors.primary}
        //   onPressItem={name => {
        //     setQrModalShow(true);
        //   }}
        // />
        <>
          <TouchableOpacity
            style={styles.plusView}
            onPress={() => setQrModalShow(true)}>
            <Image source={Icons.ic_plus} style={styles.plushIcon} />
          </TouchableOpacity>
        </>
      ) : null}

      <QRCodeModal
        isVisible={qrModalShow}
        onClose={() => setQrModalShow(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  orderStyle: {
    textAlign: 'center',
    ...commonFontStyle(fontFamily.regular, 24, colors.white),
  },
  rowLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: screen_height * 0.12,
    flexDirection: 'row',
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeStyle: {
    textAlign: 'right',
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  loadingText: {
    textAlign: 'center',
    ...commonFontStyle(fontFamily.regular, 15, colors.black),
  },
  tabText: {
    ...commonFontStyle(fontFamily.regular, 11, colors.black),
  },
  boxListText: {
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  headerText: {
    marginHorizontal: wp(16),
    marginTop: 10,
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  headerSubText: {
    fontWeight: '700',
    ...commonFontStyle(fontFamily.bold, 18, colors.black),
  },
  headermainText: {
    marginHorizontal: wp(16),
    ...commonFontStyle(fontFamily.bold, 18, colors.black),
  },
  selectView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(30),
    marginTop: hp(10),
  },
  row: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: wp(24),
    borderBottomWidth: 1,
    paddingVertical: hp(10),
    borderColor: colors.grey,
    backgroundColor: colors.primary,
  },
  plusIcon: {
    width: wp(22),
    height: wp(22),
    alignSelf: 'flex-end',
  },
  boxStyle: {
    // borderWidth: 1,
    marginHorizontal: wp(16),
    paddingHorizontal: wp(20),
    paddingVertical: wp(20),
    borderRadius: 5,
    borderColor: colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 0.22,
    backgroundColor: colors.white,
    elevation: 3,
    marginVertical: wp(8),
  },
  boxBtn: {
    // borderWidth: 1,
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
    borderRadius: 8,
  },
  boxBtnText: {
    ...commonFontStyle(fontFamily.regular, 13, colors.white),
  },
  checkBoxIcon: {
    width: wp(24),
    height: wp(24),
  },
  checkBox: {
    width: wp(22),
    height: wp(22),
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grey,
  },
  deleteIcon: {
    width: wp(22),
    height: wp(22),
    // tintColor: colors.white,
  },
  backIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.white,
  },
  plusView: {
    height: 40,
    width: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    alignSelf: 'flex-end',
    bottom: 20,
    right: 20,
  },
  plushIcon: {
    height: 14,
    width: 14,
    tintColor: colors.white,
  },
  notificationIcon: {
    width: wp(22),
    height: wp(22),
    marginTop:10,
    tintColor:"black"
  },
});
