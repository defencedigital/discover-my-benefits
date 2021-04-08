import { fromJS } from 'immutable';

import servicesReducer, { additionalPropsPerService } from '../reducer';

import Services from '../../../json/squidex/services.json';

const initialState = fromJS({
  items: Services.map(s => Object.assign(s, additionalPropsPerService)),
});

describe('servicesReducer', () => {
  it('returns the initial state', () => {
    expect(servicesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
