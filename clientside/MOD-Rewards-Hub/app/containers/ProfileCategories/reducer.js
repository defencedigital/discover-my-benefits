/*
 *
 * ProfileCategory reducer
 *
 */

import { fromJS } from 'immutable';
import ProfileCategories from '../../json/squidex/profileCategories.json';

export const additionalPropsPerProfileCategory = {};

export const initialState = fromJS({
  items: ProfileCategories.map(pc => Object.assign(pc, additionalPropsPerProfileCategory)),
});

function profileCategoriesReducer(state = initialState) {
  return state;
}

export default profileCategoriesReducer;
