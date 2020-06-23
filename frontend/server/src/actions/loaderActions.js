import * as types from '../utils/ActionTypes';

export const fetchingStarted = () => ({
    type: types.API_FETCH_START
});

export const fetchingCompleted = () => ({
    type: types.API_FETCH_COMPLETE
});
