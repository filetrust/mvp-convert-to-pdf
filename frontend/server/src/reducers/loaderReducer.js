import { fromJS } from 'immutable';
import * as types from '../utils/ActionTypes';
const initialState = fromJS({
    isFetching: false
});

export default function (state = initialState, action) {
    switch (action.type) {
        case types.API_FETCH_START:
            return {
                ...state,
                isFetching: true
            }

        case types.API_FETCH_COMPLETE:
            return {
                ...state,
                isFetching: false
            }
        case types.SET_INITIAL_STATE:
            return state = initialState;
        default:
            return { ...state };
    }
}
