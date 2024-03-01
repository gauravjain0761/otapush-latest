import axios from "axios";
import { api } from "./apiConstants";
import { screenName } from "./screensName";
import { navigationRef } from "../navigations/MainNavigator";
import { infoToast } from "../components/common/ToastMessage";

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
}

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: api.BASE_URL,
      url,
      data,
      headers,
      params,
    };
    axios(option)
      .then((response) => {
        // console.log("response-->", response);
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        console.log("error?.response?", error?.response);
        if (error?.response?.status === 401) {
          //   clearAsync();
          navigationRef?.current?.reset({
            index: 1,
            routes: [{ name: screenName.login_option }],
          });
        } else {
          infoToast(
            error?.response?.data?.data?.error ||
              "Something went wrong, please try again."
          );
        }
        reject(error);
      });
  });
