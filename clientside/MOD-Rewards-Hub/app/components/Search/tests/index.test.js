import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Search from '../index';

import { option } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  text: 'text',
  buttonText: 'buttonText',
  placeholder: 'placeholder',
  options: [option],
  onSubmit: () => {},
});

describe('Search component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Search {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
