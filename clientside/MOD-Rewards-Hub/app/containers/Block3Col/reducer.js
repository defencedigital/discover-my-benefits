/*
 *
 * Options reducer
 *
 */

import { fromJS } from 'immutable';
import Block3cols from '../../json/squidex/block3col.json';

export const additionalPropsPerBlock3col = {};

export const initialState = fromJS({
  items: Block3cols.map(t => Object.assign(t, additionalPropsPerBlock3col)),
});

function block3colReducer(state = initialState) {
  return state;
}

export default block3colReducer;
