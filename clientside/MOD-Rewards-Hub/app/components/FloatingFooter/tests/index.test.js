import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { FloatingFooter } from '../index';
import { service, question, commitmentType, option } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  service,
  questions: [question],
  commitmentTypes: [commitmentType],
  options: [option],
});

describe('FloatingFooter component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<FloatingFooter {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
