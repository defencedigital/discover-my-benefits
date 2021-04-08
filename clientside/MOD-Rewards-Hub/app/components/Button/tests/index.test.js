import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from '../index';

Enzyme.configure({ adapter: new Adapter() });

describe('Button component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Button buttonText="test" />);
    expect(html).toMatchSnapshot();
  });
});
