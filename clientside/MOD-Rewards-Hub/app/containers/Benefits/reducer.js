/*
 *
 * Benefits reducer
 *
 */

import { fromJS } from 'immutable';
import Benefits from '../../json/squidex/benefits.json';

export const additionalPropsPerBenefit = {};

export const initialState = fromJS({
  items: Benefits.map(b => Object.assign(b, additionalPropsPerBenefit)),
});

function benefitsReducer(state = initialState) {
  return state;
}

export default benefitsReducer;
