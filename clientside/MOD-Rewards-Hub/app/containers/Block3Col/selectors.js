import { createSelector } from 'reselect';

/**
 * Direct selector to the block3cols state domain
 */
const selectBlock3cols = state => state.get('block3cols');

/**
 * Select the block3col items
 */

const makeSelectBlock3cols = createSelector(selectBlock3cols, block3colState => block3colState.get('items'));

/**
 * Select a block3col ID
 */

const makeSelectBlock3colById = createSelector([makeSelectBlock3cols, (state, id) => id], (block3cols, id) => block3cols.find(block3col => block3col.get('id') === id) || false);

/**
 * Select a multiple block3cols by ID
 */

const makeSelectMultipleBlock3colsById = createSelector([makeSelectBlock3cols, (state, ids) => ids], (block3cols, ids) => block3cols.filter(block3col => ids.indexOf(block3col.get('id')) !== -1));

export { selectBlock3cols, makeSelectBlock3cols, makeSelectBlock3colById, makeSelectMultipleBlock3colsById };
