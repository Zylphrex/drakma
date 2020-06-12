import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

export default class Client {
  post(url: string, data: any) {
    return axios.post(url, data);
  }
}
