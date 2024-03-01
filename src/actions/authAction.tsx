import {AnyAction} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../helper/types';
import {
  GET_DEVICE_CODE,
  GET_DEVICE_LIST,
  IS_BUTTON_LOADING,
} from './actionsTypes';
import {POST, api} from '../helper/apiConstants';
import {makeAPIRequest} from '../helper/apiGlobal';
import {errorToast, successToast} from '../components/common/ToastMessage';
import {setAsyncToken} from '../helper/asyncStorage';
import { Alert } from 'react-native';

export const userLogin =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    dispatch({type: IS_BUTTON_LOADING, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.execute,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          const valueData = response.data?.Results?.[0];
          dispatch({type: IS_BUTTON_LOADING, payload: false});
          dispatch({
            type: GET_DEVICE_CODE,
            payload: valueData[0]['Device Code'],
          });
          console.log('response.data', response.data);

          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_BUTTON_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const onSubscribeQR =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    dispatch({type: IS_BUTTON_LOADING, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.execute,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({type: IS_BUTTON_LOADING, payload: false});
          console.log('response?.Results[0][0] ',response.data.Results[0][0]?.Result);
          if (response.data.Results[0][0]?.Result == 'ng') {
            if (request.onFailure) request.onFailure(response.data);
          }else{
            dispatch({type: GET_DEVICE_LIST, payload: response.data.Results});
            if (request.onSuccess) request.onSuccess(response.data);
          }
        }
      })
      .catch(error => {
        dispatch({type: IS_BUTTON_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const onDelectAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    dispatch({type: IS_BUTTON_LOADING, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.execute,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          console.log(response?.data);
          
          dispatch({type: IS_BUTTON_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_BUTTON_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const onNotificationrespondsAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {'Content-Type': 'application/json'};
    // dispatch({type: IS_BUTTON_LOADING, payload: true});
    console.log('request',request);
    
    return makeAPIRequest({
      method: POST,
      url: api.execute,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
       

        if (response.status === 200) {
          // dispatch({type: IS_BUTTON_LOADING, payload: false});
          console.log('response.data', response.data.Results);
          // if (request.onDemo) request.onDemo(response.data);
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_BUTTON_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };
