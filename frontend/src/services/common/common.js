import * as redux from '../../createStore';
import { fetchingStarted, fetchingCompleted } from '../../actions/loaderActions'
export default class CommonServices {

    constructor() {
        this.store = redux.store
    }

    showLoader() {
        this.store.dispatch(fetchingStarted())
    }

    hideLoader() {
        this.store.dispatch(fetchingCompleted())
    }
}
