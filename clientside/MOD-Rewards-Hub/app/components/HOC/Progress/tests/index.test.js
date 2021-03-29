import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Progress from '../index';
import { service, category, benefit, question, option, commitmentType } from '../../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  service,
  categories: [category],
  benefits: [benefit],
  questions: [question],
  options: [option],
  dependencies: [],
  calculations: [],
  commitmentTypes: [commitmentType],
  fsCalculations: [],
  children: [],
  favourites: 5,
});

describe('Progress component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Progress {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
