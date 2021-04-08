import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Head from '../index';

import { service } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  service,
  title: 'title',
});

describe('Head component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Head {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
