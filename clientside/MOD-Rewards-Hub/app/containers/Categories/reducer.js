/*
 *
 * Categories reducer
 *
 */

import { fromJS } from 'immutable';
import Categories from '../../json/squidex/categories.json';

export const additionalPropsPerCategory = {};

export const initialState = fromJS({
  items: Categories.map(c => Object.assign(c, additionalPropsPerCategory)),
});

function categoriesReducer(state = initialState) {
  return state;
}

export default categoriesReducer;
