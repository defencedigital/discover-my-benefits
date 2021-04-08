import { fromJS } from 'immutable';

import { selectCategories, makeSelectCategoryById, makeSelectMultipleCategoriesById } from '../selectors';

import { additionalPropsPerCategory } from '../reducer';
import Categories from '../../../json/squidex/categories.json';

const initialState = fromJS({
  items: Categories.map(c => Object.assign(c, additionalPropsPerCategory)),
});

describe('selectCategory', () => {
  it('should select the category state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      categories: globalState,
    });
    expect(selectCategories(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      categories: initialState,
    });
    const mockCategory = Categories[0];
    expect(makeSelectCategoryById(mockedState, mockCategory.id).toJS()).toEqual(mockCategory);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      categories: initialState,
    });
    const mockCategories = [Categories[0]];
    expect(makeSelectMultipleCategoriesById(mockedState, [mockCategories[0].id]).toJS()).toEqual(mockCategories);
  });
});
