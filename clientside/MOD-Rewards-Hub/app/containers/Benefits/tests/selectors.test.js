import { fromJS } from 'immutable';

import { selectBenefits, makeSelectBenefitById, makeSelectMultipleBenefitsById } from '../selectors';

import { additionalPropsPerBenefit } from '../reducer';
import Benefits from '../../../json/squidex/benefits.json';

const initialState = fromJS({
  items: Benefits.map(b => Object.assign(b, additionalPropsPerBenefit)),
});

describe('selectBenefit', () => {
  it('should select the benefits state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      benefits: globalState,
    });
    expect(selectBenefits(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      benefits: initialState,
    });
    const mockBenefit = Benefits[0];
    expect(makeSelectBenefitById(mockedState, mockBenefit.id).toJS()).toEqual(mockBenefit);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      benefits: initialState,
    });
    const mockBenefits = [Benefits[0]];
    expect(makeSelectMultipleBenefitsById(mockedState, [mockBenefits[0].id]).toJS()).toEqual(mockBenefits);
  });
});
