import { fromJS } from 'immutable';

import { selectCalculations, makeSelectCalculationById, makeSelectMultipleCalculationsById } from '../selectors';

import { additionalPropsPerCalculation } from '../reducer';
import Calculations from '../../../json/squidex/calculations.json';

const initialState = fromJS({
  items: Calculations.map(c => Object.assign(c, additionalPropsPerCalculation)),
});

describe('selectCalculations', () => {
  it('should select the calculations state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      calculations: globalState,
    });
    expect(selectCalculations(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      calculations: initialState,
    });
    const mockCalculation = Calculations[0];
    expect(makeSelectCalculationById(mockedState, mockCalculation.id).toJS()).toEqual(mockCalculation);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      calculations: initialState,
    });
    const mockCalculation = [Calculations[0]];
    expect(makeSelectMultipleCalculationsById(mockedState, [mockCalculation[0].id]).toJS()).toEqual(mockCalculation);
  });
});
