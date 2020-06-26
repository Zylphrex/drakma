import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

export class ApiClient {
  get(url: string, data?: any) {
    return axios.get(url, data);
  }

  post(url: string, data?: any) {
    return axios.post(url, data);
  }

  put(url: string, data?: any) {
    return axios.put(url, data);
  }
}

export default new ApiClient();
