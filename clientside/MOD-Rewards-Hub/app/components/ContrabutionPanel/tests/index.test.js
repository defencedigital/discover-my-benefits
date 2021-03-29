import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ContrabutionPanel from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  content: 'content',
  personalContribution: 780,
  changed: true,
});

describe('ContrabutionPanel component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<ContrabutionPanel {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
