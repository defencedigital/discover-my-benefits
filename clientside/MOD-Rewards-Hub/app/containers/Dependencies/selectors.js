import { createSelector } from 'reselect';

/**
 * Direct selector to the dependencies state domain
 */
const selectDependencies = state => state.get('dependencies');

/**
 * Select the dependency items
 */

const makeSelectDependencies = createSelector(selectDependencies, dependencyState => dependencyState.get('items'));

/**
 * Select a dependency by ID
 */

const makeSelectDependencyById = createSelector([makeSelectDependencies, (state, id) => id], (dependencies, id) => dependencies.find(dependency => dependency.get('id') === id) || false);

/**
 * Select a multiple dependencies by ID
 */

const makeSelectMultipleDependenciesById = createSelector([makeSelectDependencies, (state, ids) => ids], (dependencies, ids) => dependencies.filter(dependency => ids.indexOf(dependency.get('id')) !== -1));

export { selectDependencies, makeSelectDependencies, makeSelectDependencyById, makeSelectMultipleDependenciesById };
