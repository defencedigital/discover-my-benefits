/*
 *
 * Options reducer
 *
 */

import { fromJS } from 'immutable';
import Options from '../../json/squidex/options.json';

export const additionalPropsPerOption = {};

export const initialState = fromJS({
  items: Options.map(o => Object.assign(o, additionalPropsPerOption)),
});

function optionsReducer(state = initialState) {
  return state;
}

export default optionsReducer;
