import { fromJS } from 'immutable';

import subAppsReducer, { additionalPropsPerSubApp } from '../reducer';
import SubApps from '../../../json/squidex/subApps.json';

const initialState = fromJS({
  items: SubApps.map(sa => Object.assign(sa, additionalPropsPerSubApp)),
});

describe('subAppsReducer', () => {
  it('returns the initial state', () => {
    expect(subAppsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
