import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {colors} from '../theme/colors';
import {hp, wp} from '../helper/globalFunctions';
import {commonFontStyle, fontFamily} from '../theme/commonStyle';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  onDelectAction,
  onNotificationrespondsAction,
} from '../actions/authAction';
import moment from 'moment';
import {Icons} from '../theme/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = () => {
  const {goBack} = useNavigation();
  const dispatch = useDispatch<any>();
  const {params} = useRoute<any>();

  const [notificationData, setNotificationData] = useState([]);

  console.log('params', notificationData);

  const onGetNotification = () => {
    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Get_Notification',
        ParameterValues: [
          ['SubKey', params?.data?.SubKey],
          ['DeviceCode', params?.data?.deviceCode],
        ],
      },
      onSuccess: (res: any) => {
        setNotificationData(res.Results[0]);
      },
      onFailure: () => {},
    };
    dispatch(onNotificationrespondsAction(obj));
  };

  useEffect(() => {
    onGetNotification();
  }, [params]);

  const onDeleteNotification = (item: any) => {
    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Del_Notification',
        ParameterValues: [
          ['SubKey', params?.data?.SubKey],
          ['DeviceCode', params?.data?.deviceCode],
          ['MessageId', item],
        ],
      },
      onSuccess: (res: any) => {
        onGetNotification();
      },
      onFailure: () => {},
    };
    dispatch(onNotificationrespondsAction(obj));
  };

  const onDelectPress = (item: any) => {
    Alert.alert('', 'Are you sure you want to delete ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onDeleteNotification(item)},
    ]);
  };

  const onNotificationPress = (type: any, item: any) => {
    const obj = {
      data: {
        ApiKey: 'u69HAmZkrguvJ7ARAR0LMg',
        SP: 'SN_API_Submit_Respond',
        ParameterValues: [
          ['SubKey', params?.data?.SubKey],
          ['DeviceCode', params?.data?.deviceCode],
          ['Noticode', item],
          ['Respond', type],
        ],
      },
      onSuccess: (res: any) => {
        onGetNotification();
        console.log(res.Results.length);
      },
      onFailure: () => {},
    };
    dispatch(onNotificationrespondsAction(obj));
  };

  const CustomText = props => {
    const text = props.text.split(' ');
    return (
      <Text style={styles.titleSubStyle}>
        {text?.map(text => {
          if (text.startsWith('http:') || text.startsWith('https:')) {
            return (
              <Text
                onPress={() => Linking.openURL(extractLink(props))}
                style={{color: colors.primary}}>
                {text}{' '}
              </Text>
            );
          }
          return `${text} `;
        })}
      </Text>
    );
  };

  const extractLink = text => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text?.text?.match(urlRegex);
    return matches ? matches[0] : null;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FAF9F9'}}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backIconStyle}
            source={require('../assets/icons/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>{params?.data?.name}</Text>
        <View style={styles.backIconStyle} />
      </View>
      <ScrollView style={{flex: 1}}>
        {notificationData.length == 0 && (
          <Text style={styles.notificationStyle}>No Notification found</Text>
        )}
        {notificationData?.map(notification => {
          let words = notification?.Respond.split(',');
          return (
            <View style={styles.boxStyle}>
              <View style={styles.rowStyle}>
                <View style={{flex: 1}}>
                  <Text style={styles.dateStyle}>
                    {moment(notification?.Date).format('DD/MM/YYYY')}
                  </Text>
                  <Text style={styles.titleStyle}>{notification?.Title}</Text>
                  <CustomText text={notification?.Body} />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => onDelectPress(notification?.Messageid)}>
                    <Image
                      source={Icons.ic_delete}
                      style={[styles.deleteIcon, {marginLeft: 10}]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {notification?.UserRespond !== '' ? (
                <Text style={styles.userRespondText}>
                  User Response : {notification?.UserRespond}
                </Text>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  {words?.map((list: any) => {
                    if (list) {
                      return (
                        <TouchableOpacity
                          style={styles.btnStyle}
                          onPress={() =>
                            onNotificationPress(list, notification?.Messageid)
                          }>
                          <Text style={styles.btnTextStyle}>{list}</Text>
                        </TouchableOpacity>
                      );
                    } else {
                      return null;
                    }
                  })}
                </View>
              )}
              {/* {notification.Respond == 'ok' ? (
                <TouchableOpacity style={styles.btnStyle} onPress={()=>onNotificationPress("OK",notification)}>
                  <Text style={styles.btnTextStyle}>OK</Text>
                </TouchableOpacity>
              ) : notification.Respond == 'Yes,No' ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.btnStyle} onPress={()=>onNotificationPress("Yes",notification)}>
                    <Text style={styles.btnTextStyle}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnStyle, {marginLeft: 10}]} onPress={()=>onNotificationPress("No",notification)}>
                    <Text style={styles.btnTextStyle}>No</Text>
                  </TouchableOpacity>
                </View>
              ) : null} */}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(24),
    borderBottomWidth: 1,
    paddingVertical: hp(10),
    borderColor: colors.grey,
    backgroundColor: colors.primary,
  },
  headerTitleText: {
    textAlign: 'center',
    // marginLeft: wp(90),
    ...commonFontStyle(fontFamily.regular, 18, colors.white),
  },
  userRespondText: {
    marginTop: 10,
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  backIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.white,
  },
  boxStyle: {
    marginHorizontal: wp(16),
    paddingHorizontal: wp(20),
    paddingVertical: wp(20),
    borderRadius: 5,
    borderColor: colors.grey,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 0.22,
    backgroundColor: colors.white,
    elevation: 3,
    marginVertical: wp(8),
  },
  rowStyle: {
    flexDirection: 'row',
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  titleSubStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.grey),
  },
  dateStyle: {
    marginBottom: 5,
    ...commonFontStyle(fontFamily.regular, 12, colors.grey),
  },
  btnStyle: {
    marginTop: 10,
    width: 90,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: colors.grey,
    paddingVertical: 3,
    marginRight: 5,
  },
  btnTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  notificationStyle: {
    marginTop: 10,
    textAlign: 'center',
    ...commonFontStyle(fontFamily.regular, 18, colors.black),
  },
  deleteIcon: {
    width: wp(22),
    height: wp(22),
    // tintColor: colors.white,
  },
});

export default NotificationScreen;
