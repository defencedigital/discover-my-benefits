import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ContainerInner from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  class: 'class',
  children: ['<div>sf</div>'],
});

describe('ContainerInner component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<ContainerInner {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
