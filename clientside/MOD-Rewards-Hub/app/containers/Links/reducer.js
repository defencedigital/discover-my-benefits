/*
 *
 * Links reducer
 *
 */

import { fromJS } from 'immutable';
import Links from '../../json/squidex/links.json';

export const additionalPropsPerLink = {};

export const initialState = fromJS({
  items: Links.map(b => Object.assign(b, additionalPropsPerLink)),
});

function linksReducer(state = initialState) {
  return state;
}

export default linksReducer;
