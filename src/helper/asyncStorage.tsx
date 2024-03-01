import AsyncStorage from "@react-native-async-storage/async-storage";

export const asyncKeys = {
  // clear in logout time
  token: "@token",
};

// is login token set and get

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const getAsyncToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token) {
    return JSON.parse(token);
  } else {
    return null;
  }
};

// is login check user is login or not
export const isUserLoginAsync = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token !== null) {
    return true;
  }
  return false;
};

// clear key this async
export const clearAsync = async () => {
  await AsyncStorage.multiRemove([asyncKeys.token]);
};
