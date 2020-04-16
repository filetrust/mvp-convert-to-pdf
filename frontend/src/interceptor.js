import Axios from 'axios'
import { fetchingStarted, fetchingCompleted } from './actions/loaderActions'

export default {
    setupInterceptors: (store) => {
        Axios.interceptors.request.use(function (config) {
            store.dispatch(fetchingStarted())
            return config;
        }, function (error) {
            store.dispatch(fetchingCompleted())
            return Promise.reject(error);
        });

        Axios.interceptors.response.use(function (response) {
            store.dispatch(fetchingCompleted())
            return response;
        }, function (error) {
            store.dispatch(fetchingCompleted())
            return Promise.reject(error);
        });
    }
}
