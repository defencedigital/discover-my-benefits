/*
 *
 * AS reducer
 *
 */

import { fromJS } from 'immutable';
import AS from '../../json/squidex/accessibilityStatement.json';

export const additionalPropsPerAS = {};

export const initialState = fromJS({
  items: AS.map(s => Object.assign(s, additionalPropsPerAS)),
});

function asReducer(state = initialState) {
  return state;
}

export default asReducer;
