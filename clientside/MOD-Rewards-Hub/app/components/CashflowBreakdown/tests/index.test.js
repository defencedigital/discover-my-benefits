import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CashflowBreakdown from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  titleHint: 'titleHint',
  content: 'content',
  total: 'total',
  firstMonth: 'firstMonth',
  secondMonth: 'secondMonth',
  thirdMonth: 'thirdMonth',
  monthly: 'monthly',
});

describe('CashflowBreakdown component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<CashflowBreakdown {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
