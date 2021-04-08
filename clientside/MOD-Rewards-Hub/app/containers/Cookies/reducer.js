/*
 *
 * Cookie reducer
 *
 */

import { fromJS } from 'immutable';
import Cookies from '../../json/squidex/cookies.json';

export const additionalPropsPerCookies = {};

export const initialState = fromJS({
  items: Cookies.map(c => Object.assign(c, additionalPropsPerCookies)),
});

function cookiesReducer(state = initialState) {
  return state;
}

export default cookiesReducer;
