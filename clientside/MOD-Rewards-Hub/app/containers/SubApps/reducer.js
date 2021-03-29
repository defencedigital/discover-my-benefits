/*
 *
 * SubApps reducer
 *
 */

import { fromJS } from 'immutable';
import SubApps from '../../json/squidex/subApps.json';

export const additionalPropsPerSubApp = {};

export const initialState = fromJS({
  items: SubApps.map(sa => Object.assign(sa, additionalPropsPerSubApp)),
});

function subAppsReducer(state = initialState) {
  return state;
}

export default subAppsReducer;
