import { fromJS } from 'immutable';

import { selectProfileCategories, makeSelectProfileCategoryById, makeSelectMultipleProfileCategoriesById } from '../selectors';

import { additionalPropsPerProfileCategory } from '../reducer';
import ProfileCategories from '../../../json/squidex/profileCategories.json';

const initialState = fromJS({
  items: ProfileCategories.map(pc => Object.assign(pc, additionalPropsPerProfileCategory)),
});

describe('selectProfileCategory', () => {
  it('should select the profile category state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      profileCategories: globalState,
    });
    expect(selectProfileCategories(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      profileCategories: initialState,
    });
    const mockProfileCategory = ProfileCategories[0];
    expect(makeSelectProfileCategoryById(mockedState, mockProfileCategory.id).toJS()).toEqual(mockProfileCategory);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      profileCategories: initialState,
    });
    const mockProfileCategories = [ProfileCategories[0]];
    expect(makeSelectMultipleProfileCategoriesById(mockedState, [mockProfileCategories[0].id]).toJS()).toEqual(mockProfileCategories);
  });
});
