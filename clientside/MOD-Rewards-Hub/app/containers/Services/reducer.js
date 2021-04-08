/*
 *
 * Services reducer
 *
 */

import { fromJS } from 'immutable';
import Services from '../../json/squidex/services.json';

export const additionalPropsPerService = {};

export const initialState = fromJS({
  items: Services.map(s => Object.assign(s, additionalPropsPerService)),
});

function servicesReducer(state = initialState) {
  return state;
}

export default servicesReducer;
