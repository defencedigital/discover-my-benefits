/*
 *
 * Calculations reducer
 *
 */

import { fromJS } from 'immutable';
import Calculations from '../../json/squidex/calculations.json';

export const additionalPropsPerCalculation = {};

export const initialState = fromJS({
  items: Calculations.map(c => Object.assign(c, additionalPropsPerCalculation)),
});

function calculationsReducer(state = initialState) {
  return state;
}

export default calculationsReducer;
