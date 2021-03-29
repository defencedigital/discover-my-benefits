import { createSelector } from 'reselect';

/**
 * Direct selector to the block4cols state domain
 */
const selectBlock4cols = state => state.get('block4cols');

/**
 * Select the block4col items
 */

const makeSelectBlock4cols = createSelector(selectBlock4cols, block4colState => block4colState.get('items'));

/**
 * Select a block4col ID
 */

const makeSelectBlock4colById = createSelector([makeSelectBlock4cols, (state, id) => id], (block4cols, id) => block4cols.find(block4col => block4col.get('id') === id) || false);

/**
 * Select a multiple block4cols by ID
 */

const makeSelectMultipleBlock4colsById = createSelector([makeSelectBlock4cols, (state, ids) => ids], (block4cols, ids) => block4cols.filter(block4col => ids.indexOf(block4col.get('id')) !== -1));

export { selectBlock4cols, makeSelectBlock4cols, makeSelectBlock4colById, makeSelectMultipleBlock4colsById };
