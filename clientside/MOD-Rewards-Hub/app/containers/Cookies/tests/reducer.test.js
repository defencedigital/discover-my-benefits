import { fromJS } from 'immutable';

import cookiesReducer, { additionalPropsPerCookies } from '../reducer';
import Cookies from '../../../json/squidex/cookies.json';

const initialState = fromJS({
  items: Cookies.map(sa => Object.assign(sa, additionalPropsPerCookies)),
});

describe('cookiesReducer', () => {
  it('returns the initial state', () => {
    expect(cookiesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
