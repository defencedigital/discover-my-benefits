import { fromJS } from 'immutable';

import profileCategoriesReducer, { additionalPropsPerProfileCategory } from '../reducer';
import ProfileCategories from '../../../json/squidex/profileCategories.json';

const initialState = fromJS({
  items: ProfileCategories.map(pc => Object.assign(pc, additionalPropsPerProfileCategory)),
});

describe('profileCategoriesReducer', () => {
  it('returns the initial state', () => {
    expect(profileCategoriesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
