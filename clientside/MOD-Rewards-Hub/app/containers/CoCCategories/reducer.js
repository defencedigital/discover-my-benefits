/*
 *
 * COC categories reducer
 *
 */

import { fromJS } from 'immutable';
import cocCategories from '../../json/squidex/cocCategories.json';

export const additionalPropsPerCalculation = {};

export const initialState = fromJS({
  items: cocCategories.map(c => Object.assign(c, additionalPropsPerCalculation)),
});

function calculationsReducer(state = initialState) {
  return state;
}

export default calculationsReducer;
