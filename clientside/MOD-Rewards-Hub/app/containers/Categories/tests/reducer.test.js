import { fromJS } from 'immutable';

import categoriesReducer, { additionalPropsPerCategory } from '../reducer';
import Categories from '../../../json/squidex/categories.json';

const initialState = fromJS({
  items: Categories.map(c => Object.assign(c, additionalPropsPerCategory)),
});

describe('categoriesReducer', () => {
  it('returns the initial state', () => {
    expect(categoriesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
