/*
 *
 * Options reducer
 *
 */

import { fromJS } from 'immutable';
import Block4cols from '../../json/squidex/block4col.json';

export const additionalPropsPerBlock4col = {};

export const initialState = fromJS({
  items: Block4cols.map(t => Object.assign(t, additionalPropsPerBlock4col)),
});

function block4colReducer(state = initialState) {
  return state;
}

export default block4colReducer;
