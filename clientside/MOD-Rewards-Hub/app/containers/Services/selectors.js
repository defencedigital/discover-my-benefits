import { createSelector } from 'reselect';

/**
 * Direct selector to the services state domain
 */
const selectServices = state => state.get('services');

/**
 * Select the service items
 */

const makeSelectServices = createSelector(selectServices, servicesState => servicesState.get('items'));

/**
 * Select a service by ID
 */

const makeSelectServiceById = createSelector([makeSelectServices, (state, id) => id], (services, id) => services.find(service => service.get('id') === id) || false);

/**
 * Select a multiple services by ID
 */

const makeSelectMultipleServicesById = createSelector([makeSelectServices, (state, ids) => ids], (services, ids) => services.filter(service => ids.indexOf(service.get('id')) !== -1));

export { selectServices, makeSelectServices, makeSelectServiceById, makeSelectMultipleServicesById };
