import { createSelector } from 'reselect';

/**
 * Direct selector to the cookies state domain
 */
const selectCookies = state => state.get('cookies');

/**
 * Select the cookie items
 */

const makeSelectCookies = createSelector(selectCookies, cookieState => cookieState.get('items'));

/**
 * Select a cookie by ID
 */

const makeSelectCookiesById = createSelector([makeSelectCookies, (state, id) => id], (cookies, id) => cookies.find(cookie => cookie.get('id') === id) || false);

/**
 * Select a multiple cookies by ID
 */

const makeSelectMultipleCookiesById = createSelector([makeSelectCookies, (state, ids) => ids], (cookies, ids) => cookies.filter(cookie => ids.indexOf(cookie.get('id')) !== -1));

export { selectCookies, makeSelectCookies, makeSelectCookiesById, makeSelectMultipleCookiesById };
