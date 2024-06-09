import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';
import { NameToken } from './const';
//import { ApiRoute } from './const';

const BACKEND_URL = 'http://localhost:4000';
//const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    //timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      /*
      if(config.url === `${ApiRoute.RefreshToken}${ApiRoute.Login}`) {
        const refreshToken = Token.get(NameToken.RefreshToken);

        if (refreshToken) {
          config.headers['Authorization'] = `Bearer ${refreshToken}`;
        }

        return config;
      }
*/
      const token = Token.get(NameToken.Token);

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      toast.dismiss();
      toast.warn(error.response ? error.response.data.error : error.message);

      return Promise.reject(error);
    }
  );

  return api;
};
