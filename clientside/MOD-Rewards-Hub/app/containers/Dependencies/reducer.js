/*
 *
 * Dependencies reducer
 *
 */

import { fromJS } from 'immutable';
import Dependencies from '../../json/squidex/dependencies.json';

export const additionalPropsPerDependency = {};

export const initialState = fromJS({
  items: Dependencies.map(b => Object.assign(b, additionalPropsPerDependency)),
});

function dependenciesReducer(state = initialState) {
  return state;
}

export default dependenciesReducer;
