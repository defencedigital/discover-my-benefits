/*
 *
 * Terms reducer
 *
 */

import { fromJS } from 'immutable';
import Terms from '../../json/squidex/terms.json';

export const additionalPropsPerTerm = {};

export const initialState = fromJS({
  items: Terms.map(t => Object.assign(t, additionalPropsPerTerm)),
});

function termsReducer(state = initialState) {
  return state;
}

export default termsReducer;
