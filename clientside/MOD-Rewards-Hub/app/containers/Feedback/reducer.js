import { fromJS } from 'immutable';
import { FETCH_DATA } from './constants';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';
const SUCCESS_STATUS = 'success';
const FAILURE_STATUS = 'failure';

const initialUserState = fromJS({
  status: 'idle', // explicit finite state
});

const fetchIdleDataReducer = (state, action) => {
  // state.status is "idle"
  switch (action.type) {
    case FETCH_DATA: {
      return state.merge({
        status: IDLE_STATUS,
      });
    }
    default:
      return state;
  }
};
const fetchLoadingDataReducer = (state, action) => {
  // state.status is "idle"
  switch (action.type) {
    case FETCH_DATA: {
      return state.merge({
        status: LOADING_STATUS,
      });
    }
    default:
      return state;
  }
};
const fetchSuccessDataReducer = (state, action) => {
  // state.status is "idle"
  switch (action.type) {
    case FETCH_DATA: {
      return state.merge({
        status: SUCCESS_STATUS,
      });
    }
    default:
      return state;
  }
};
const fetchFailureDataReducer = (state, action) => {
  // state.status is "idle"
  switch (action.type) {
    case FETCH_DATA: {
      return state.merge({
        status: FAILURE_STATUS,
      });
    }
    default:
      return state;
  }
};

function fetchDataReducer(state = initialUserState, action) {
  switch (action.status) {
    case IDLE_STATUS: {
      return fetchIdleDataReducer(state, action);
    }
    case LOADING_STATUS: {
      return fetchLoadingDataReducer(state, action);
    }
    case SUCCESS_STATUS: {
      return fetchSuccessDataReducer(state, action);
    }
    case FAILURE_STATUS: {
      return fetchFailureDataReducer(state, action);
    }
    default:
      // this should never be reached
      return state;
  }
}

export default fetchDataReducer;
