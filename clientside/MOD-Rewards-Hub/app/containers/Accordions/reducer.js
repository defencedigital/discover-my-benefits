/*
 *
 * Links reducer
 *
 */

import { fromJS } from 'immutable';
import Accordions from '../../json/squidex/accordions.json';

export const additionalPropsPerAcc = {};

export const initialState = fromJS({
  items: Accordions.map(b => Object.assign(b, additionalPropsPerAcc)),
});

function accordionsReducer(state = initialState) {
  return state;
}

export default accordionsReducer;
