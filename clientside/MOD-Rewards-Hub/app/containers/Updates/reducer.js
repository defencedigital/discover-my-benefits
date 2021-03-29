/*
 *
 * Updates reducer
 *
 */

import { fromJS } from 'immutable';
import Updates from '../../json/squidex/updates.json';

export const additionalPropsPerUpdate = {};

export const initialState = fromJS({
  items: Updates.map(o => Object.assign(o, additionalPropsPerUpdate)),
});

function updatesReducer(state = initialState) {
  return state;
}

export default updatesReducer;
