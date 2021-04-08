import { createSelector } from 'reselect';

/**
 * Direct selector to the subApps state domain
 */
const selectSubApps = state => state.get('subApps');

/**
 * Select the subApp items
 */

const makeSelectSubApps = createSelector(selectSubApps, subAppState => subAppState.get('items'));

/**
 * Select a subApp by ID
 */

const makeSelectSubAppById = createSelector([makeSelectSubApps, (state, id) => id], (subApps, id) => subApps.find(subApp => subApp.get('id') === id) || false);

/**
 * Select a multiple subApps by ID
 */

const makeSelectMultipleSubAppsById = createSelector([makeSelectSubApps, (state, ids) => ids], (subApps, ids) => subApps.filter(subApp => ids.indexOf(subApp.get('id')) !== -1));

export { selectSubApps, makeSelectSubApps, makeSelectSubAppById, makeSelectMultipleSubAppsById };
