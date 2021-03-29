import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import BenefitsBox from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  benefits: 24,
});

describe('Benefits box component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<BenefitsBox {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
