import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DepositBreakdown from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  content: 'content',
  total: '1',
});

describe('DepositBreakdown component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<DepositBreakdown {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
