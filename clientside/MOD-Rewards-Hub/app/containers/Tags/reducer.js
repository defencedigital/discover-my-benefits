/*
 *
 * Options reducer
 *
 */

import { fromJS } from 'immutable';
import Tags from '../../json/squidex/tags.json';

export const additionalPropsPerTag = {};

export const initialState = fromJS({
  items: Tags.map(t => Object.assign(t, additionalPropsPerTag)),
});

function tagsReducer(state = initialState) {
  return state;
}

export default tagsReducer;
