import { createSelector } from 'reselect';

/**
 * Direct selector to the Coccategories state domain
 */
const selectCocCategories = state => state.get('cocCategories');

/**
 * Select the Coccategory items
 */

const makeSelectCocCategories = createSelector(selectCocCategories, categoryState => categoryState.get('items'));

/**
 * Select a Coccategory by ID
 */

const makeSelectCocCategoryById = createSelector([makeSelectCocCategories, (state, id) => id], (categories, id) => categories.find(category => category.get('id') === id) || false);

/**
 * Select a multiple Coccategories by ID
 */

const makeSelectCocMultipleCategoriesById = createSelector([makeSelectCocCategories, (state, ids) => ids], (categories, ids) => categories.filter(category => ids.indexOf(category.get('id')) !== -1));

export { selectCocCategories, makeSelectCocCategories, makeSelectCocCategoryById, makeSelectCocMultipleCategoriesById };
