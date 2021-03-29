import { fromJS } from 'immutable';

import { selectSubApps, makeSelectSubAppById, makeSelectMultipleSubAppsById } from '../selectors';

import { additionalPropsPerSubApp } from '../reducer';
import SubApps from '../../../json/squidex/subApps.json';

const initialState = fromJS({
  items: SubApps.map(sa => Object.assign(sa, additionalPropsPerSubApp)),
});

describe('selectSubApp', () => {
  it('should select the subApp state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      subApps: globalState,
    });
    expect(selectSubApps(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      subApps: initialState,
    });
    const mockSubApp = SubApps[0];
    expect(makeSelectSubAppById(mockedState, mockSubApp.id).toJS()).toEqual(mockSubApp);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      subApps: initialState,
    });
    const mockSubApps = [SubApps[0]];
    expect(makeSelectMultipleSubAppsById(mockedState, [mockSubApps[0].id]).toJS()).toEqual(mockSubApps);
  });
});
