import { fromJS } from 'immutable';

import { selectDependencies, makeSelectDependencyById, makeSelectMultipleDependenciesById } from '../selectors';

import { additionalPropsPerDependency } from '../reducer';
import Dependencies from '../../../json/squidex/benefits.json';

const initialState = fromJS({
  items: Dependencies.map(b => Object.assign(b, additionalPropsPerDependency)),
});

describe('selectDependency', () => {
  it('should select the benefits state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      dependencies: globalState,
    });
    expect(selectDependencies(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      dependencies: initialState,
    });
    const mockDependency = Dependencies[0];
    expect(makeSelectDependencyById(mockedState, mockDependency.id).toJS()).toEqual(mockDependency);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      dependencies: initialState,
    });
    const mockDependencies = [Dependencies[0]];
    expect(makeSelectMultipleDependenciesById(mockedState, [mockDependencies[0].id]).toJS()).toEqual(mockDependencies);
  });
});
