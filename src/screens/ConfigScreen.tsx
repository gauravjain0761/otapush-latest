import {
  Alert,
  Image,
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

import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {FloatingAction} from 'react-native-floating-action';
import LottieView from 'lottie-react-native';

import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../redux/hooks';
import {GET_DEVICE_LIST} from '../actions/actionsTypes';
import {onDelectAction} from '../actions/authAction';
import {Icons} from '../theme/icons';
import {colors} from '../theme/colors';
import {hp, screen_height, wp} from '../helper/globalFunctions';
import {screenName} from '../helper/screensName';
import {fontFamily, commonFontStyle} from '../theme/commonStyle';

const ConfigScreen = () => {
  const {navigate, goBack} = useNavigation();
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
  const [isEnable, setIsEnable] = useState(false);
  const {params} = useRoute<any>();

  const actions = [
    // {
    //   text: 'QR Scanner',
    //   icon: Icons.ic_qrcode,
    //   name: 'bt_accessibility',
    //   position: 2,
    // },
  ];

  useEffect(() => {
    const update = params?.data?.index;
    console.log('data', params.data.enable);
    setIsEnable(params.data.enable);
    setDataList(params?.data?.list);
  }, []);

  // console.log('dataList',dataList);

  const onSelectAll = async () => {
    const updateData = dataList?.map(list => {
      return {...list, ConfigState: !selectBox};
    });
    await setSelectBox(!selectBox);
    await setDataList(updateData);
  };

  const onSelectItem = async (item: any) => {
    const updateData = dataList?.map(list => {
      if (item.ConfigCode == list.ConfigCode) {
        return {...list, ConfigState: !item.ConfigState};
      } else {
        return {...list};
      }
    });
    const update = updateData?.filter(list => list?.ConfigState === true);
    setConfigList(update);
    await setSelectBox(false);
    await setDataList(updateData);
  };

  const onConfirmConfig = (i: any) => {
    const updateDataList = [];
    // const update = dataList?.filter(list => list?.ConfigState === false);
    // setConfigList(update);
    dataList.map(item => {
      console.log('item.ConfigState', item.ConfigState);

      let update = `${item.ConfigCode}=${!item.ConfigState ? 0 : 1}`;
      updateDataList.push(update);
    });

    const array = updateDataList;
    const result = array.join(',');
    console.log('result', result);

    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Manage_Subscription',
        ParameterValues: [
          ['SubKey', params?.data?.SubKey],
          ['DeviceCode', params?.data?.deviceCode],
          ['Action', 'config'],
          ['Config', `${result}`],
        ],
      },
      onSuccess: async (res: any) => {
        const firestoreDocument = await firestore()
          .collection('Users')
          .doc(params?.data?.deviceCode)
          .get();
        const updatedUser = firestoreDocument.data();
        setSelectBox(false);
        setSelectConfig(!selectConfig);
        console.log('res?.Results[1]', res?.Results[1]);

        setDataList(res?.Results[1]);
        const updateList = params?.data?.dataList.map((list, index) => {
          if (index === params?.data?.index) {
            return {...list, config: res?.Results[1], enable: isEnable};
          } else {
            return {...list};
          }
        });
        firestore()
          .collection('Users')
          .doc(params?.data?.deviceCode)
          .update({list: updateList})
          .then(async res => {});
      },
      onFailure: () => {
        setLoging(false);
      },
    };
    dispatch(onDelectAction(obj));
  };

  const onEnablePress = async () => {
    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Manage_Subscription',
        ParameterValues: [
          ['SubKey', params?.data?.SubKey],
          ['DeviceCode', params?.data?.deviceCode],
          ['Action', !isEnable ? 'enable' : 'disable'],
          ['Config', ''],
        ],
      },
      onSuccess: async (res: any) => {
        const updateList = params?.data?.dataList.map((list, index) => {
          if (index === params?.data?.index) {
            return {...list, enable: !isEnable};
          } else {
            return {...list};
          }
        });
        firestore()
          .collection('Users')
          .doc(params?.data?.deviceCode)
          .update({list: updateList})
          .then(async res => {
            setIsEnable(!isEnable);
          });
      },
      onFailure: () => {
        setLoging(false);
      },
    };
    dispatch(onDelectAction(obj));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FAF9F9'}}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backIconStyle}
            source={require('../assets/icons/back.png')}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 50}}>
          <Text style={[styles.orderStyle]}>{'Config List'}</Text>
        </View>
        <View style={[styles.rightView, {}]}>
          <TouchableOpacity
            onPress={() => onEnablePress()}
            style={[
              styles.boxBtn,
              {
                
                backgroundColor: !isEnable ? colors.green : colors.red_500,
              },
            ]}>
            <Text style={styles.boxBtnText}>
              {!isEnable ? 'enable' : 'disable'}
            </Text>
          </TouchableOpacity>
        </View>
        {dataList.length !== 0 ? (
          <>
            <TouchableOpacity
              disabled={!isEnable}
              style={[
                styles.boxBtn,
                {
                  borderWidth: 1,
                  marginLeft: 10,
                  borderColor: colors.white,
                },
              ]}
              onPress={onConfirmConfig}>
              <Text style={styles.boxBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{width: 0}} />
        )}
      </View>
      <ScrollView style={{flex: 1}}>
        {loging ? (
          <View style={styles.rowLoading}>
            <Text style={styles.loadingText}>
              {'Please wait we are\nfetching device information….'}
            </Text>
            <LottieView
              source={require('../assets/Lottie/loding.json')}
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
            {dataList.length !== 0 && (
              <View style={[styles.selectView, {marginTop: 20}]}>
                <Text style={styles.codeStyle}>{'Select ALL'}</Text>
                <TouchableOpacity
                  style={[styles.checkBox, {borderWidth: selectBox ? 0 : 1}]}
                  disabled={!isEnable}
                  onPress={onSelectAll}>
                  {selectBox && (
                    <Image
                      source={Icons.ic_check}
                      style={styles.checkBoxIcon}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <ScrollView style={{flex: 1}}>
              <View style={{marginTop: hp(10)}}>
                {dataList.length == 0 && (
                  <Text style={styles.notificationStyle}>No config found</Text>
                )}
                {dataList?.map((item: any) => {
                  return (
                    <View
                      style={[
                        styles.boxStyle,
                        {
                          backgroundColor: isEnable
                            ? colors.white
                            : colors.grey_1,
                        },
                      ]}>
                      <View style={{flex: 1}}>
                        <Text style={styles.boxListText}>
                          {item?.ConfigCode}
                        </Text>
                        <Text style={styles.boxListText}>
                          {item?.ConfigText}
                        </Text>
                        <Text
                          style={[
                            styles.boxListText,
                          ]}>{`ConfigStatus :  ${item?.ConfigState}`}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onSelectItem(item)}
                        disabled={!isEnable}
                        style={[
                          styles.checkBox,
                          {borderWidth: item?.ConfigState ? 0 : 1},
                        ]}>
                        {item?.ConfigState && (
                          <Image
                            source={Icons.ic_check}
                            style={styles.checkBoxIcon}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  orderStyle: {
    textAlign: 'center',
    // marginLeft: wp(90),
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
  notificationStyle: {
    marginTop: 10,
    textAlign: 'center',
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  selectView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(30),
    marginTop: hp(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(24),
    borderBottomWidth: 1,
    paddingVertical: hp(10),
    borderColor: colors.grey,
    backgroundColor: colors.primary,
    // flex:1
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
      width: 10,
      height: 10,
    },
    shadowOpacity: 10.22,
    shadowRadius: 10.22,
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
    width: wp(18),
    height: wp(18),
    tintColor: colors.white,
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
    height: 14,
    width: 14,
  },
});
