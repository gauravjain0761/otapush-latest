import { GET_DEVICE_CODE, GET_DEVICE_LIST, IS_BUTTON_LOADING, IS_LOADING } from "../actions/actionsTypes";

const initialState = {
  isLoading: false,
  isButtonLoading: false,
  deviceCode:'',
  deviceList:[]
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case IS_BUTTON_LOADING: {
      return { ...state, isButtonLoading: action.payload };
    }
    case GET_DEVICE_CODE: {
      return { ...state, deviceCode: action.payload };
    }
    case GET_DEVICE_LIST: {
      return { ...state, deviceList: action.payload };
    }
    default:
      return state;
  }
}
